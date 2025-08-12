// lib/user-api.ts

import 'server-only'
import { adminApiCall } from "./api-client"
import type { ZephrUser, ZephrAccountUser } from "@/lib/zephr-types"

export async function getUserDetails(userId: string): Promise<ZephrUser> {
  console.log(`[getUserDetails] === FETCHING USER DETAILS FOR: ${userId} ===`)

  try {
    const response = await adminApiCall(`/v3/users/${userId}`)
    console.log(`[getUserDetails] Raw API response for user ${userId}:`, JSON.stringify(response, null, 2))

    // Handle different possible response structures
    let user: any = null

    if (response && response.data) {
      // Response has a 'data' wrapper: { "data": { user_object }, "status": 200, ... }
      console.log(`[getUserDetails] Found 'data' property in response`)
      user = response.data
    } else if (response && response.user_id) {
      // Response is the user object directly
      console.log(`[getUserDetails] Response appears to be user object directly`)
      user = response
    } else if (response && Array.isArray(response) && response.length > 0) {
      // Response is an array with user object
      console.log(`[getUserDetails] Response is an array, taking first element`)
      user = response[0]
    } else {
      console.error(`[getUserDetails] Unexpected response structure:`, response)
      throw new Error(`Unexpected response structure from /v3/users/${userId}. Response: ${JSON.stringify(response)}`)
    }

    // Validate that we have a user object
    if (!user) {
      throw new Error(`No user data found in response for ${userId}`)
    }

    // Ensure required fields exist
    if (!user.user_id) {
      console.error(`[getUserDetails] User data is missing user_id. User object:`, user)
      throw new Error(`User data for ${userId} is missing required user_id field.`)
    }

    // Ensure attributes exist (initialize as empty object if missing)
    if (!user.attributes) {
      console.log(`[getUserDetails] No attributes found, initializing empty object`)
      user.attributes = {}
    }

    // Ensure identifiers exist
    if (!user.identifiers) {
      console.log(`[getUserDetails] No identifiers found, attempting to construct from available data`)
      user.identifiers = {
        email_address: user.email_address || user.user_email || `user-${userId}@unknown.com`,
      }
    }

    // Ensure email_address exists in identifiers
    if (!user.identifiers.email_address) {
      user.identifiers.email_address = user.email_address || user.user_email || `user-${userId}@unknown.com`
    }

    // Set default email_verified if missing
    if (user.email_verified === undefined) {
      user.email_verified = true
    }

    // Log the specific attributes we care about
    console.log(`[getUserDetails] User attributes:`, JSON.stringify(user.attributes, null, 2))
    if (user.attributes && Object.keys(user.attributes).length > 0) {
      console.log(`[getUserDetails] firstname: "${user.attributes.firstname}"`)
      console.log(`[getUserDetails] lastname: "${user.attributes.lastname}"`)
      console.log(`[getUserDetails] job-area: "${user.attributes["job-area"]}"`)
      console.log(`[getUserDetails] organization: "${user.attributes.organization}"`)
    } else {
      console.log(`[getUserDetails] No attributes found or attributes object is empty`)
    }

    const finalUser: ZephrUser = {
      user_id: user.user_id,
      identifiers: user.identifiers,
      attributes: user.attributes || {},
      email_verified: user.email_verified,
      created_date: user.created_date,
      modified_date: user.modified_date,
      account_id: user.account_id,
      user_type: user.user_type,
    }

    console.log(`[getUserDetails] === SUCCESSFULLY PROCESSED USER DETAILS ===`)
    console.log(`[getUserDetails] Final user object:`, JSON.stringify(finalUser, null, 2))

    return finalUser
  } catch (error) {
    console.error(`[getUserDetails] Error fetching user details for ${userId}:`, error)

    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          `Network error: Unable to reach the user details endpoint. This could be due to CORS restrictions, network issues, or the endpoint being unavailable.`,
        )
      } else if (error.message.includes("404")) {
        throw new Error(`User not found: The user ${userId} may not exist.`)
      } else if (error.message.includes("401") || error.message.includes("403")) {
        throw new Error(`Authentication error: You may not have permission to access user details.`)
      }
    }

    throw error
  }
}

export async function updateUserAttributes(userId: string, attributes: Record<string, any>): Promise<void> {
  console.log(`[updateUserAttributes] Updating user ${userId} with:`, JSON.stringify(attributes, null, 2))

  await adminApiCall(`/v3/users/${userId}/attributes`, {
    method: "PATCH",
    body: JSON.stringify(attributes),
  })

  console.log(`[updateUserAttributes] Successfully updated user ${userId}`)
}

export async function getUsersByAccount(accountId: string): Promise<ZephrUser[]> {
  console.log(`[getUsersByAccount] Fetching users for account: ${accountId}`)

  const response = await adminApiCall(`/v3/accounts/${accountId}/users`)
  console.log(`[getUsersByAccount] API response:`, JSON.stringify(response, null, 2))

  const accountUsers: ZephrAccountUser[] = Array.isArray(response) ? response : response.results || response.data || []

  const users: ZephrUser[] = accountUsers.map((accountUser) => ({
    user_id: accountUser.user_id,
    account_id: accountUser.account_id,
    user_type: accountUser.user_type,
    identifiers: { email_address: accountUser.user_email },
    attributes: accountUser.attributes || {},
    email_verified: true,
  }))

  console.log(`[getUsersByAccount] Processed ${users.length} users`)
  return users
}
