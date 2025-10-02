"use server"

import { loginUser } from "@/lib/zephr-api"
import { redirect } from "next/navigation"
import { logServer } from "@/lib/logger"

export async function loginAction(_prevState: any, formData: FormData) {
  logServer("loginAction_start", {})
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")
  const result = await loginUser(email, password)
  if (!result.success) {
    const msg = encodeURIComponent(result.error || "Login failed")
    logServer("loginAction_redirect_error", { msg })
    redirect(`/login?error=${msg}`)
  }
  if (result.isAdmin) {
    logServer("loginAction_redirect_home", {})
    redirect("/")
  }
  logServer("loginAction_redirect_denied", {})
  redirect(`/login?error=${encodeURIComponent("Access denied. Admin privileges required.")}`)
}

export async function submitLogin(formData: FormData) {
  logServer("submitLogin_start", {})
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")
  const result = await loginUser(email, password)
  if (!result.success) {
    const msg = encodeURIComponent(result.error || "Login failed")
    logServer("submitLogin_redirect_error", { msg })
    redirect(`/login?error=${msg}`)
  }
  if (result.isAdmin) {
    logServer("submitLogin_redirect_home", {})
    redirect("/")
  }
  logServer("submitLogin_redirect_denied", {})
  redirect(`/login?error=${encodeURIComponent("Access denied. Admin privileges required.")}`)
}
