import { put, list, del } from "@vercel/blob"

/* ------------------------------------------------------------------ */
/*  Environment / helpers                                             */
/* ------------------------------------------------------------------ */

const token =
  process.env.BLOB_READ_WRITE_TOKEN ??
  process.env.VERCEL_BLOB_TOKEN ??
  ""

if (!token) {
  // still compile-time safe – just warns in dev / logs in prod
  console.warn(
    "[Blob] No Vercel Blob token set – storage calls will fail on server",
  )
}

const PREFIX = "templates"
export const tplKey = (acc: string, name: string) =>
  `${PREFIX}/${acc}/${name}.json`

/* ------------------------------------------------------------------ */
/*  SAVE                                                              */
/* ------------------------------------------------------------------ */

export async function saveTpl(
  acc: string,
  name: string,
  json: unknown,
  allowOverwrite = true,
) {
  await put(tplKey(acc, name), JSON.stringify(json, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite,
    cacheControlMaxAge: 60,
    token, // put *does* accept an explicit token
  })
}

/* ------------------------------------------------------------------ */
/*  LOAD                                                              */
/* ------------------------------------------------------------------ */

export async function loadTpl<T = unknown>(
  acc: string,
  name: string,
): Promise<T | null> {
  const key = tplKey(acc, name)

  // list does NOT take ‘token’ in the options object (it reads from env)
  const { blobs } = await list({ prefix: key, limit: 1 })

  if (!blobs || blobs.length === 0) return null

  // new SDK returns .downloadUrl (fallback .url for older fetches)
  const url =
    (blobs[0] as any).downloadUrl || (blobs[0] as any).url /* eslint-disable-line */

  if (!url) return null

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch template ${name}`)

  return (await res.json()) as T
}

/* ------------------------------------------------------------------ */
/*  LIST (names only)                                                 */
/* ------------------------------------------------------------------ */

export async function listTpls(acc: string): Promise<string[]> {
  const { blobs } = await list({ prefix: `${PREFIX}/${acc}/` })
  return (blobs || []).map((b) =>
    b.pathname.split("/").pop()!.replace(/\.json$/, ""),
  )
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                            */
/* ------------------------------------------------------------------ */

export const deleteTpl = (acc: string, name: string) =>
  del(tplKey(acc, name), { token })

/* ------------------------------------------------------------------ */
/*  LIST with metadata (uploadedAt)                                   */
/* ------------------------------------------------------------------ */

export async function listTplsWithMeta(acc: string) {
  const { blobs } = await list({ prefix: `${PREFIX}/${acc}/` })
  return blobs.map((b) => ({
    name: b.pathname.split("/").pop()!.replace(/\.json$/, ""),
    uploadedAt: b.uploadedAt, // provided by Vercel Blob SDK
  }))
}
