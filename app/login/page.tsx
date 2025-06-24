import { LoginForm } from "@/components/login-form"
import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[#0B0B1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Zephr Admin</h1>
            <p className="text-gray-400">Sign in to manage your accounts</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
