// lib/user-actions.ts
"use server"

import "server-only"
import { adminApiCall } from "./api-client"

export type UpdateUserResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Patch Zephr user attributes.
 * Uses the correct endpoint: /v3/users/:id/attributes (PATCH)
 */
export async function updateUserAttributesAction(
  userId: string,
  attributes: Record<string, any>
): Promise<UpdateUserResult> {
  try {
    if (!userId) {
      return { success: false, error: "Missing userId" }
    }
    if (!attributes || typeof attributes !== "object") {
      return { success: false, error: "Invalid attributes payload" }
    }

    // Zephr expects the raw attributes object at this endpoint.
    await adminApiCall(`/v3/users/${encodeURIComponent(userId)}/attributes`, {
      method: "PATCH",
      body: JSON.stringify(attributes),
      headers: { "Content-Type": "application/json" },
    })

    return { success: true }
  } catch (err: any) {
    const msg =
      err?.message ??
      (typeof err === "string" ? err : "Failed to update user attributes")
    return { success: false, error: msg }
  }
}
