import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { UserHeader } from "@/components/user-header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin={true}>
      <div className="relative min-h-screen bg-[#0B0B1A] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        <div className="relative z-10 flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <UserHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
