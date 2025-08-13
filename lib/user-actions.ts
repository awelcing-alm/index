// lib/user-actions.ts
"use server"

import { adminApiCall } from "@/lib/api-client"

export async function updateUserAttributesAction(
  userId: string,
  patch: Record<string, any>
) {
  // We only update attributes; Zephr accepts partial updates
  // NOTE: we assume { attributes: { ...patch } } payload. Adjust if your client differs.
  const body = JSON.stringify({ attributes: patch })
  const res = await adminApiCall(`/v3/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body,
  })
  // If your adminApiCall throws on !ok, nothing else to do here.
  return res
}
