import LoginForm from "@/components/login-form"
import { getCurrentUser } from "@/lib/zephr-api"
import { redirect } from "next/navigation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser()
  if (user) redirect("/")

  const sp = await searchParams
  const error = sp?.error || ""

  return (
    <div className="min-h-screen bg-paper">
      {/* subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "hsl(var(--line))",
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-none border border-line bg-paper p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
                <span className="font-serif text-lg">Z</span>
              </div>
              <h1 className="font-serif text-2xl text-ink">InDecks</h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Admin Portal
              </p>
            </div>

            <LoginForm initialError={error} />

          </div>

          <div className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
            <span className="align-middle text-[10px] uppercase tracking-wider">v</span>
            <span className="ml-1 align-middle">Admin Console</span>
          </div>
        </div>
      </main>
    </div>
  )
}