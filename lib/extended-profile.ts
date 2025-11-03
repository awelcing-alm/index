// lib/extended-profile.ts
import "server-only"
import { logServer } from "@/lib/logger"
import { sql } from "@/lib/db"
import { adminApiCall } from "@/lib/zephr-api"
import { PRODUCT_APP_IDS, ProductKey } from "@/lib/product-templates"

// Lightweight wrapper intended for account-level Extended Profile storage
// We do not know the exact Zephr endpoints in this environment, so this
// module provides safe, no-throw helpers that can later be wired to the
// real API. For now, we optimistically report support and no-op on writes.

export async function hasExtendedProfileApp(_accountId: string, appId: string): Promise<boolean> {
  try {
    // If an allowlist env var is set, only enable when appId is present there
    const allow = (process.env.ZEPHR_EXTPROFILE_APPS || "").toLowerCase()
    if (allow) return allow.split(",").map((s) => s.trim()).includes(appId.toLowerCase())
    // Default to true so UI can proceed; backend wiring can be added later
    return true
  } catch (e: any) {
    logServer("extended_profile_capability_error", { appId, error: e?.message })
    return false
  }
}

// Placeholder load/save for product templates per app. These are designed to
// be replaced with calls to the Zephr Extended Profile API.

export type ProductTemplateDoc = {
  templates?: Record<string, {
    description?: string | null
    attributes?: Record<string, boolean>
    overwriteFalse?: boolean
    createdAt?: string
    updatedAt?: string
  }>
}

export async function loadProductTemplates(_accountId: string, _appId: string): Promise<ProductTemplateDoc> {
  // No-op placeholder: return empty doc
  return { templates: {} }
}

export async function saveProductTemplates(
  _accountId: string,
  _appId: string,
  _doc: ProductTemplateDoc,
): Promise<void> {
  // No-op placeholder for now
  return
}

/* ==========================================================================
   User-level Extended Profile helpers
   ========================================================================== */

// Try several likely endpoints; tolerate 404s and shape variance
async function tryUserAppFetch(userId: string, appId: string): Promise<any | null> {
  const candidates = [
    `/v3/users/${encodeURIComponent(userId)}/applications/${encodeURIComponent(appId)}/profile`,
    `/v3/users/${encodeURIComponent(userId)}/applications/${encodeURIComponent(appId)}`,
    `/v3/users/${encodeURIComponent(userId)}/extended-profiles/${encodeURIComponent(appId)}`,
    `/v3/users/${encodeURIComponent(userId)}/apps/${encodeURIComponent(appId)}/profile`,
  ]
  for (const path of candidates) {
    try {
      const data = await adminApiCall(path, { method: "GET" })
      if (data != null) return data
    } catch (e: any) {
      // swallow and continue; we probe all possible shapes
      continue
    }
  }
  return null
}

export async function getUserAppProfile(userId: string, appId: string): Promise<any | null> {
  try {
    // 1) Try remote first
    const data = await tryUserAppFetch(userId, appId)
    if (data != null) {
      // cache locally (best-effort)
      try {
        await ensureLocalTable()
        await sql/* sql */`
          INSERT INTO public.user_extended_profiles (user_id, app_id, data)
          VALUES (${userId}, ${appId}, ${JSON.stringify(data)}::jsonb)
          ON CONFLICT (user_id, app_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
        `
      } catch {}
      return data
    }
    // 2) Fallback to local cache
    try {
      await ensureLocalTable()
      const row = (await sql<{ data: any | null }>`
        SELECT data FROM public.user_extended_profiles WHERE user_id = ${userId} AND app_id = ${appId} LIMIT 1;
      `).rows[0]
      if (row && row.data != null) return row.data
    } catch {}
    return null
  } catch (e: any) {
    logServer("getUserAppProfile_error", { userId, appId, error: e?.message })
    return null
  }
}

export async function upsertUserAppProfile(userId: string, appId: string, profile: any): Promise<boolean> {
  const stringBodies = [
    JSON.stringify(profile),
    JSON.stringify({ data: profile }),
    JSON.stringify({ profile }),
  ]

  const base = `/v3/users/${encodeURIComponent(userId)}`
  const endpoints = [
    `${base}/applications/${encodeURIComponent(appId)}/profile`,
    `${base}/applications/${encodeURIComponent(appId)}`,
    `${base}/extended-profiles/${encodeURIComponent(appId)}`,
    `${base}/apps/${encodeURIComponent(appId)}/profile`,
  ]

  // Try PUT across endpoints and body shapes
  for (const path of endpoints) {
    for (const body of stringBodies) {
      try {
        await adminApiCall(path, { method: "PUT", body })
        logServer("upsertUserAppProfile_ok", { path, userId, appId })
        // also persist locally
        try {
          await ensureLocalTable()
          await sql/* sql */`
            INSERT INTO public.user_extended_profiles (user_id, app_id, data)
            VALUES (${userId}, ${appId}, ${JSON.stringify(profile)}::jsonb)
            ON CONFLICT (user_id, app_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
          `
        } catch {}
        return true
      } catch (e: any) {
        logServer("upsertUserAppProfile_try_put_fail", { path, userId, appId, error: e?.message })
      }
    }
  }
  // Fallback POST
  for (const path of endpoints) {
    for (const body of stringBodies) {
      try {
        await adminApiCall(path, { method: "POST", body })
        logServer("upsertUserAppProfile_ok_post", { path, userId, appId })
        try {
          await ensureLocalTable()
          await sql/* sql */`
            INSERT INTO public.user_extended_profiles (user_id, app_id, data)
            VALUES (${userId}, ${appId}, ${JSON.stringify(profile)}::jsonb)
            ON CONFLICT (user_id, app_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
          `
        } catch {}
        return true
      } catch (e: any) {
        logServer("upsertUserAppProfile_try_post_fail", { path, userId, appId, error: e?.message })
      }
    }
  }
  // Persist locally even if remote failed so UI reflects intent and can sync later
  try {
    await ensureLocalTable()
    await sql/* sql */`
      INSERT INTO public.user_extended_profiles (user_id, app_id, data)
      VALUES (${userId}, ${appId}, ${JSON.stringify(profile)}::jsonb)
      ON CONFLICT (user_id, app_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
    `
    logServer("upsertUserAppProfile_local_only", { userId, appId })
    return true
  } catch (e: any) {
    logServer("upsertUserAppProfile_all_failed", { userId, appId, error: e?.message })
    return false
  }
}

/* --------------------------------------------------------------------------
   Local cache table (best-effort)                                            
---------------------------------------------------------------------------*/
let _tableEnsured = false
async function ensureLocalTable() {
  if (_tableEnsured) return
  try {
    await sql/* sql */`
      CREATE TABLE IF NOT EXISTS public.user_extended_profiles (
        user_id   text NOT NULL,
        app_id    text NOT NULL,
        data      jsonb,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, app_id)
      );
    `
    _tableEnsured = true
  } catch (e) {
    // ignore; operates as best-effort cache
  }
}

export type UserAppProbe = {
  key: ProductKey
  appId: string
  exists: boolean
  data?: any
}

export async function probeKnownUserApps(userId: string): Promise<UserAppProbe[]> {
  const entries: [ProductKey, string][] = Object.entries(PRODUCT_APP_IDS) as any
  const results: UserAppProbe[] = []
  await Promise.all(
    entries.map(async ([key, appId]) => {
      let data: any | null = null
      try {
        data = await getUserAppProfile(userId, appId)
      } catch {}
      results.push({ key, appId, exists: !!(data && (typeof data === "object" ? Object.keys(data).length > 0 : true)), data: data || undefined })
    }),
  )
  return results
}

