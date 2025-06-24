"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUsersByAccount } from "./user-api"
import { getAccountsByOwner } from "./account-api"
import { getProductsByAccount } from "./product-api"
import { publicApiCall } from "./public-api"
import type { ZephrAccount } from "./account-api"
import type { ZephrUser } from "./user-api"
import type { ZephrProduct } from "./product-api"
import { adminApiCall } from "./api-client"

export interface LoginResult {
  success: boolean
  error?: string
  isAdmin?: boolean
  userEmail?: string
  accounts?: ZephrAccount[]
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    console.log("Attempting login for:", email)

    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password: password },
      }),
    })

    if (!loginResponse.ok) {
      return { success: false, error: "Invalid email or password" }
    }

    const loginData = await loginResponse.json()
    console.log("Login response:", loginData)

    // Extract session cookie
    const setCookieHeader = loginResponse.headers.get("set-cookie")
    let sessionCookie = ""
    if (setCookieHeader) {
      const cookieMatch = setCookieHeader.match(/blaize_session=([^;]+)/)
      if (cookieMatch) {
        sessionCookie = cookieMatch[1]
      }
    }

    // Get accounts owned by this user
    let userAccounts: ZephrAccount[] = []
    let isAdmin = false

    try {
      userAccounts = await getAccountsByOwner(email)
      isAdmin = userAccounts.length > 0
      console.log(`Found ${userAccounts.length} accounts for user:`, userAccounts)
    } catch (adminError) {
      console.error("Failed to fetch user accounts:", adminError)
      isAdmin = false
    }

    // Store session information
    const cookieStore = await cookies()

    if (sessionCookie) {
      cookieStore.set("zephr_session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set("is_admin", isAdmin.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set("user_accounts", JSON.stringify(userAccounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    if (userAccounts.length > 0) {
      cookieStore.set("active_account_id", userAccounts[0].account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return {
      success: true,
      isAdmin,
      userEmail: email,
      accounts: userAccounts,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("user_email")?.value
  const isAdmin = cookieStore.get("is_admin")?.value === "true"
  const session = cookieStore.get("zephr_session")?.value
  const accountsJson = cookieStore.get("user_accounts")?.value
  const activeAccountId = cookieStore.get("active_account_id")?.value

  if (!userEmail) {
    return null
  }

  let accounts: ZephrAccount[] = []
  try {
    if (accountsJson) {
      accounts = JSON.parse(accountsJson)
    }
  } catch (error) {
    console.error("Error parsing user accounts from cookie:", error)
  }

  const activeAccount = accounts.find((account) => account.account_id === activeAccountId) || accounts[0]

  return {
    email: userEmail,
    isAdmin,
    session,
    accounts,
    activeAccount,
  }
}

export async function switchAccount(accountId: string) {
  const cookieStore = await cookies()
  cookieStore.set("active_account_id", accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getUsersForCurrentAccount(): Promise<ZephrUser[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) {
    return []
  }

  try {
    return await getUsersByAccount(user.activeAccount.account_id)
  } catch (error) {
    console.error("Error fetching users for account:", error)
    return []
  }
}

export async function getProductsForCurrentAccount(): Promise<ZephrProduct[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) {
    return []
  }

  try {
    return await getProductsByAccount(user.activeAccount.account_id)
  } catch (error) {
    console.error("Error fetching products for account:", error)
    return []
  }
}

export async function testApiCredentials() {
  try {
    console.log("Testing admin API credentials...")
    const response = await adminApiCall("/v3/accounts?page=1&rpp=1")
    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("Admin API test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Admin API test failed",
    }
  }
}

export async function testPublicApi(email: string, password: string) {
  try {
    console.log("Testing public API with credentials:", email)
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password: password },
      }),
    })

    if (!loginResponse.ok) {
      return {
        success: false,
        error: `HTTP ${loginResponse.status}: ${loginResponse.statusText}`,
      }
    }

    const loginData = await loginResponse.json()
    return {
      success: true,
      data: loginData,
      status: loginResponse.status,
      statusText: loginResponse.statusText,
    }
  } catch (error) {
    console.error("Public API test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Public API test failed",
    }
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("zephr_session")
  cookieStore.delete("user_email")
  cookieStore.delete("is_admin")
  cookieStore.delete("user_accounts")
  cookieStore.delete("active_account_id")
  redirect("/login")
}
