"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { loginUser } from "@/lib/auth-actions"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const result = await loginUser(email.trim(), password)
      if (result.success) {
        if (result.isAdmin) router.push("/")
        else setError("Access denied. Admin privileges required.")
      } else setError(result.error || "Login failed")
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm space-y-6 rounded-none border border-line bg-paper p-6"
    >

      {error && (
        <Alert className="rounded-none border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10">
          <AlertDescription className="text-[hsl(var(--destructive))]">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
<Label htmlFor="email" className="text-gray-800 dark:text-white">
          Email
        </Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="rounded-none border border-line bg-paper pl-10 text-ink placeholder:text-[hsl(var(--muted-foreground))] focus:border-ink focus:ring-0"
            required
            autoComplete="username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-ink">
          Password
        </Label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            aria-hidden="true"
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-none border border-line bg-paper pl-10 text-ink placeholder:text-[hsl(var(--muted-foreground))] focus:border-ink focus:ring-0"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
        Administrator access required
      </p>
    </form>
  )
}
