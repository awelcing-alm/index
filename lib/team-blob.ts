import { put, list, del } from "@vercel/blob"

/* ------------------------------------------------------------------ */
/*  Vercel Blob helpers for teams                                    */
/*
 * Teams are persisted as JSON blobs in a folder per account.  The
 * canonical shape stored on disk uses camelCase keys to more closely
 * mirror the UI expectations (e.g. `defaultTemplate` instead of
 * `default_template`). When saving a team we normalise the object
 * before writing and always allow overwriting an existing record.
 */
/* ------------------------------------------------------------------ */

const token =
  process.env.BLOB_READ_WRITE_TOKEN ??
  process.env.VERCEL_BLOB_TOKEN ??
  ""

if (!token) {
  // warn at runtime if no token has been provided. Calls will fail
  console.warn(
    "[TeamBlob] No Vercel Blob token set – team storage calls will fail",
  )
}

/** Prefix for all team blobs. */
const TEAM_PREFIX = "teams"

/** Build a blob key for a given account and team id. */
export const teamKey = (accId: string, teamId: string) =>
  `${TEAM_PREFIX}/${accId}/${teamId}.json`

/* ------------------------------------------------------------------ */
/*  SAVE                                                              */
/*
 * Persist a team definition to Vercel Blob storage.  The supplied
 * object may use snake_case keys (from the database) or camelCase. We
 * normalise the keys to camelCase and drop any undefined values.
 */
export async function saveTeamBlob(
  accId: string,
  team: {
    id: string
    name: string
    slug?: string | null
    color?: string | null
    icon?: string | null
    default_template?: string | null
    defaultTemplate?: string | null
    product_grant_ids?: string[] | null
    productGrantIds?: string[] | null
  },
  allowOverwrite = true,
) {
  if (!token) return
  const key = teamKey(accId, team.id)
  // normalise keys to camelCase
  const out: Record<string, any> = {
    id: team.id,
    name: team.name,
  }
  if (team.color) out.color = team.color
  if (team.icon) out.icon = team.icon
  // prefer explicitly provided camelCase defaultTemplate
  const dt = team.defaultTemplate ?? team.default_template
  if (dt) out.defaultTemplate = dt
  // prefer camelCase productGrantIds
  const pgs = team.productGrantIds ?? team.product_grant_ids
  if (pgs && Array.isArray(pgs) && pgs.length) out.productGrantIds = pgs

  await put(key, JSON.stringify(out, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite,
    cacheControlMaxAge: 60,
    token,
  })
}

/* ------------------------------------------------------------------ */
/*  LOAD                                                              */
/*
 * Fetch a team JSON blob from storage. Returns the parsed JSON or
 * null if none exists. This helper uses the list() API first to
 * determine existence and then fetches the URL directly.
 */
export async function loadTeamBlob<T = any>(
  accId: string,
  teamId: string,
): Promise<T | null> {
  const key = teamKey(accId, teamId)
  const { blobs } = await list({ prefix: key, limit: 1 })
  if (!blobs || blobs.length === 0) return null
  const url =
    (blobs[0] as any).downloadUrl || (blobs[0] as any).url /* eslint-disable-line */
  if (!url) return null
  const res = await fetch(url)
  if (!res.ok) return null
  return (await res.json()) as T
}

/* ------------------------------------------------------------------ */
/*  LIST                                                              */
/*
 * List all team IDs for a given account. Returns an array of team
 * identifiers (no file extension) based on the blob prefix.  We do
 * not fetch the contents here – consumers can call loadTeamBlob on
 * specific IDs as needed.
 */
export async function listTeamBlobs(accId: string): Promise<string[]> {
  const prefix = `${TEAM_PREFIX}/${accId}/`
  const { blobs } = await list({ prefix })
  return (blobs || []).map((b) =>
    b.pathname.split("/").pop()!.replace(/\.json$/, ""),
  )
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                            */
/*
 * Remove a team definition from storage. This does not affect the
 * database record; callers should ensure the DB entry is removed
 * separately if desired.
 */
export async function deleteTeamBlob(accId: string, teamId: string) {
  if (!token) return
  await del(teamKey(accId, teamId), { token })
}
