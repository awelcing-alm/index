"use server"

import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { logServer } from "@/lib/logger"
import { HAS_ADMIN_KEYS } from "./env"
import { adminApiCall, publicApiCall } from "./http"
import { getAccountsByOwner } from "./accounts"
import type { LoginResult, ZephrAccount } from "./types"

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    logServer("login_start", { email })
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password },
      }),
    })

    const setCookieHeader = loginResponse.headers.get("set-cookie") || ""
    const cookieMatch = setCookieHeader.match(/blaize_session=([^;]+)/)
    const sessionCookie = cookieMatch ? cookieMatch[1] : ""

    const accounts = HAS_ADMIN_KEYS ? await getAccountsByOwner(email) : []
    const isAdmin = accounts.length > 0

    const jar = await cookies()

    if (sessionCookie) {
      jar.set("zephr_session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    jar.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    jar.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    jar.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    if (accounts.length > 0) {
      jar.set("active_account_id", accounts[0].account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    await loginResponse.text().catch(() => "")

    logServer("login_success", { email, isAdmin, accounts: accounts.length })

    return { success: true, isAdmin, userEmail: email, accounts }
  } catch (err: any) {
    logServer("login_error", { email, error: err?.message })
    return { success: false, error: err?.message || "Login failed" }
  }
}

export async function getCurrentUser() {
  const jar = await cookies()
  const userEmail = jar.get("user_email")?.value
  const session = jar.get("zephr_session")?.value
  const activeAccountIdCookie = jar.get("active_account_id")?.value

  if (!userEmail) return null

  const accounts = await getAccountsByOwner(userEmail)
  const isAdmin = accounts.length > 0

  const activeAccount =
    accounts.find((a) => a.account_id === activeAccountIdCookie) || accounts[0]

  try {
    jar.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    jar.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    if (activeAccount && activeAccount.account_id !== activeAccountIdCookie) {
      jar.set("active_account_id", activeAccount.account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  } catch {}

  return {
    email: userEmail,
    isAdmin,
    role: isAdmin ? "admin" : "member",
    session,
    accounts,
    activeAccount,
  }
}

export async function switchAccount(accountId: string) {
  const jar = await cookies()
  jar.set("active_account_id", accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function logoutUser() {
  const jar = await cookies()
  jar.delete("zephr_session")
  jar.delete("user_email")
  jar.delete("is_admin")
  jar.delete("user_accounts")
  jar.delete("active_account_id")
  redirect("/login")
}

export async function testApiCredentials() {
  try {
    const res = await adminApiCall("/v3/accounts?page=1&rpp=1")
    return { success: true, data: res }
  } catch (e: any) {
    return { success: false, error: e?.message || "Admin API test failed" }
  }
}

export async function testPublicApi(email: string, password: string) {
  try {
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password },
      }),
    })
    const data = await loginResponse.json().catch(() => ({}))
    return { success: true, data, status: loginResponse.status, statusText: loginResponse.statusText }
  } catch (e: any) {
    return { success: false, error: e?.message || "Public API test failed" }
  }
}
