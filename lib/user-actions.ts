"use server"

import type { ZephrUser } from "@/lib/zephr-types"
import { getUserDetails, updateUserAttributes } from "@/lib/user-api"

/**
 * Fetch a single user with full attributes (Admin API).
 * Thin server-action wrapper around lib/user-api.ts for UI components to call.
 */
export async function getUserDetailsAction(userId: string): Promise<ZephrUser> {
  try {
    return await getUserDetails(userId)
  } catch (err: any) {
    // Re-throw a clean message so client components show a helpful error
    throw new Error(err?.message || "Failed to fetch user details")
  }
}

/**
 * Patch attributes for a user (Admin API).
 * Uses the correct endpoint: /v3/users/{id}/attributes with a plain attributes object.
 */
export async function updateUserAttributesAction(
  userId: string,
  attributes: Record<string, any>
): Promise<{ success: true }> {
  try {
    await updateUserAttributes(userId, attributes)
    return { success: true as const }
  } catch (err: any) {
    // Let callers catch and display; throw so UI paths that rely on try/catch keep working
    throw new Error(err?.message || "Failed to update user attributes")
  }
}
