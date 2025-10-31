"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock } from "lucide-react"
import { SubmitButton } from "@/components/submit-button"

type LoginFormProps = {
  initialError?: string
  action: (formData: FormData) => void | Promise<void>
}

export default function LoginForm({ initialError, action }: LoginFormProps) {
  // Local error display derived from server redirect param
  const [error] = useState(initialError || "")

  return (
    <form action={action} className="mx-auto w-full max-w-sm space-y-6 rounded-none border border-line bg-paper p-6">

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
            name="email"
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
            name="password"
            placeholder="••••••••"
            className="rounded-none border border-line bg-paper pl-10 text-ink placeholder:text-[hsl(var(--muted-foreground))] focus:border-ink focus:ring-0"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <SubmitButton />

      <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
        Administrator access required
      </p>
    </form>
  )
}

// Optional named export for convenience
export { LoginForm }