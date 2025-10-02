// lib/admin-zephr.ts

/** Safe response wrapper returning both parsed JSON and text */
async function parseResponse(r: Response) {
  const t = await r.text()
  try {
    return { ok: r.ok, status: r.status, headers: r.headers, json: JSON.parse(t), text: t }
  } catch {
    return { ok: r.ok, status: r.status, headers: r.headers, json: undefined as any, text: t }
  }
}

export async function putExtendedProfileAdmin(id: string, appId: string, body: unknown) {
  const r = await fetch(`/api/user-index/users/${encodeURIComponent(id)}/profile/${encodeURIComponent(appId)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  )
  return parseResponse(r)
}

export async function getExtendedProfileAdmin(id: string, appId: string) {
  const r = await fetch(`/api/user-index/users/${encodeURIComponent(id)}/profile/${encodeURIComponent(appId)}`)
  return parseResponse(r)
}
