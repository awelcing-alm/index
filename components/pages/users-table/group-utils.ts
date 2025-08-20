"use client"

import type { UiUser, GroupWithCount } from "./types"

export const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

export const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

/** pulls a "group" value from assorted attribute shapes */
export function getRawGroupValue(u: UiUser): string | null {
  const a = u?.attributes ?? {}
  const candidates: unknown[] = [
    a.group, a.Group, a["group-name"], a["group_name"],
    a["group-id"], a["group_id"], a["group-slug"], a["group_slug"],
  ]
  for (const c of candidates) {
    if (!c) continue
    if (typeof c === "string") return c.trim()
    if (typeof c === "object" && c && "value" in (c as any) && typeof (c as any).value === "string") {
      return (c as any).value.trim()
    }
  }
  return null
}

/** best-effort fallback resolution (when server membership not yet hydrated) */
export function resolveGroupForUser(
  row: UiUser,
  maps: {
    byId: Record<string, GroupWithCount>
    byNameLower: Record<string, GroupWithCount>
    bySlug: Record<string, GroupWithCount>
    bySlugifiedName: Record<string, GroupWithCount>
  }
): GroupWithCount | null {
  if (row.group_id && maps.byId[row.group_id]) return maps.byId[row.group_id]
  const raw = getRawGroupValue(row); if (!raw) return null
  const v = raw.trim(); if (!v) return null
  if (UUID_V4.test(v) && maps.byId[v]) return maps.byId[v]
  const lower = v.toLowerCase()
  if (maps.byNameLower[lower]) return maps.byNameLower[lower]
  if (maps.bySlug[v]) return maps.bySlug[v]
  const vSlug = slugify(v)
  if (maps.bySlug[vSlug]) return maps.bySlug[vSlug]
  if (maps.bySlugifiedName[vSlug]) return maps.bySlugifiedName[vSlug]
  return null
}
