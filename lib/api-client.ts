// lib/api-client.ts
// Client-safe shim: no 'server-only', no static imports of zephr-api.

type Init = RequestInit

function assertServer(fnName: string): void {
  if (typeof window !== "undefined") {
    throw new Error(
      `${fnName} is server-only. Call a Next API route or a server action from the client instead.`
    )
  }
}

export async function adminApiCall(path: string, options: Init = {}) {
  assertServer("adminApiCall")
  const mod = await import("./zephr-api") // loaded only on server
  return mod.adminApiCall(path, options)
}

export async function publicApiCall(path: string, options: Init = {}) {
  assertServer("publicApiCall")
  const mod = await import("./zephr-api")
  return mod.publicApiCall(path, options)
}

// ⛔️ Do NOT re-export types from './zephr-api' here.
// Client code should import types from './zephr-types'.
