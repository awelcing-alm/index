import crypto from "crypto"

const ZEPHR_BASE_URL = process.env.ZEPHR_BASE_URL || "https://alm.api.zephr.com"
const ZEPHR_ACCESS_KEY = process.env.ZEPHR_ACCESS_KEY || "a2252e52-a897-4bfa-8e45-7269ed39631a"
const ZEPHR_SECRET_KEY = process.env.ZEPHR_SECRET_KEY || "7ee7fc30-1737-4122-8d00-f345c6d7968c"

function signRequest(method: string, fullPath: string, body?: string): string {
  const [path, queryString] = fullPath.split("?")
  const query = queryString || ""
  const timestamp = Date.now().toString()
  const nonce = crypto.randomBytes(16).toString("hex")
  const bodyContent = body || ""

  const hash = crypto.createHash("sha256")
  hash.update(ZEPHR_SECRET_KEY, "utf8")
  hash.update(bodyContent, "utf8")
  hash.update(path, "utf8")
  hash.update(query, "utf8")
  hash.update(method.toUpperCase(), "utf8")
  hash.update(timestamp, "utf8")
  hash.update(nonce, "utf8")

  const signature = hash.digest("hex")
  return `ZEPHR-HMAC-SHA256 ${ZEPHR_ACCESS_KEY}:${timestamp}:${nonce}:${signature}`
}

export async function adminApiCall(path: string, options: RequestInit = {}) {
  const method = options.method || "GET"
  const body = options.body as string
  const authHeader = signRequest(method, path, body)

  console.log(`[adminApiCall] ${method} ${ZEPHR_BASE_URL}${path}`)

  const response = await fetch(`${ZEPHR_BASE_URL}${path}`, {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...options.headers,
    },
    body: body || undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  if (response.status === 204) {
    return null
  }

  const responseText = await response.text()
  return responseText ? JSON.parse(responseText) : null
}
