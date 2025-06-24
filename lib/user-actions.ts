"use server"

import { getUserDetails, updateUserAttributes } from "./user-api"

export async function getUserDetailsAction(userId: string) {
  try {
    console.log(`[getUserDetailsAction] Server action: Getting details for user ${userId}`)
    const user = await getUserDetails(userId)
    console.log(`[getUserDetailsAction] Successfully retrieved user:`, JSON.stringify(user, null, 2))
    return { success: true, data: user }
  } catch (error) {
    console.error(`[getUserDetailsAction] Server action error:`, error)

    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Failed to get user details"
    const errorDetails = error instanceof Error ? error.stack : String(error)

    console.error(`[getUserDetailsAction] Full error details:`, errorDetails)

    return {
      success: false,
      error: errorMessage,
      details: errorDetails,
    }
  }
}

export async function updateUserAttributesAction(userId: string, attributes: Record<string, any>) {
  try {
    console.log(`[updateUserAttributesAction] Server action: Updating attributes for user ${userId}`, attributes)
    await updateUserAttributes(userId, attributes)
    return { success: true }
  } catch (error) {
    console.error(`[updateUserAttributesAction] Server action error:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user attributes",
    }
  }
}
