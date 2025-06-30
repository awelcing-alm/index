"use server"

import { adminApiCall } from "./zephr-api"
import { getUserDetails } from "./user-api"

export async function getUserDetailsAction(userId: string) {
  try {
    console.log("[getUserDetailsAction] ↗ GET", userId)
    const user = await getUserDetails(userId)
    return { success: true, data: user }
  } catch (err: any) {
    console.error("[getUserDetailsAction] error:", err)
    return {
      success: false,
      error: err?.message ?? "Failed to get user details",
      details: String(err),
    }
  }
}

export async function updateUserAttributesAction(
  userId: string,
  attributes: Record<string, any>,
) {
  try {
    console.log("[updateUserAttributesAction] ↗ PATCH", userId, attributes)

    await adminApiCall(`/v3/users/${userId}/attributes`, {
      method: "PATCH",
      body: JSON.stringify(attributes),
    })

    return { success: true }
  } catch (err: any) {
    console.error("[updateUserAttributesAction] error:", err)
    return {
      success: false,
      error: err?.message ?? "Failed to update user attributes",
    }
  }
}
