"use server"

import "server-only"
import crypto from "crypto"
import { logServer } from "@/lib/logger"
import { ZEPHR_ACCESS_KEY, ZEPHR_BASE_URL, ZEPHR_PUBLIC_BASE_URL, ZEPHR_SECRET_KEY } from "./env"

function signRequest(method: string, fullPath: string, body?: string) {
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

  const authHeader = `ZEPHR-HMAC-SHA256 ${ZEPHR_ACCESS_KEY}:${timestamp}:${nonce}:${signature}`
  return { authHeader }
}

export async function adminApiCall(path: string, options: RequestInit = {}) {
  const method = (options.method || "GET").toUpperCase()
  const rawBody = options.body as string | undefined
  const { authHeader } = signRequest(method, path, rawBody)

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...(options.headers || {}),
    },
  }

  if (rawBody && ["POST", "PUT", "PATCH"].includes(method)) {
    fetchOptions.body = rawBody
  }

  try {
    const res = await fetch(`${ZEPHR_BASE_URL}${path}`, fetchOptions)

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      logServer("adminApiCall_error", { method, path, status: res.status, text })
      throw new Error(
        `Admin API ${method} ${path} failed: ${res.status} ${res.statusText} - ${text}`,
      )
    }

    if (res.status === 204) return null
    const text = await res.text()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch (err: any) {
    logServer("adminApiCall_exception", { method, path, error: err?.message })
    throw err
  }
}

export async function publicApiCall(path: string, options: RequestInit = {}) {
  const url = `https://${ZEPHR_PUBLIC_BASE_URL}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      logServer("publicApiCall_error", { method: options.method || "GET", path, status: res.status, text })
      throw new Error(
        `Public API ${options.method || "GET"} ${path} failed: ${res.status} ${res.statusText} - ${text}`,
      )
    }
    return res
  } catch (err: any) {
    logServer("publicApiCall_exception", { method: options.method || "GET", path, error: err?.message })
    throw err
  }
}
