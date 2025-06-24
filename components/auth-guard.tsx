import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import type React from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export async function AuthGuard({ children, requireAdmin = true }: AuthGuardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (requireAdmin && !user.isAdmin) {
    redirect("/unauthorized")
  }

  return <>{children}</>
}
