// components/global/app-search.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Users, Folder, FileText, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SearchUser = { user_id: string; email: string; firstname?: string | null; lastname?: string | null }
type SearchGroup = { id: string; name: string; icon?: string | null; slug?: string | null }
type SearchTemplate = { name: string }

type Results = {
  users: SearchUser[]
  groups: SearchGroup[]
  templates: SearchTemplate[]
}

const useDebouncedValue = <T,>(value: T, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function AppSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const debounced = useDebouncedValue(q, 250)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Results>({ users: [], groups: [], templates: [] })
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open || !debounced.trim()) {
      setResults({ users: [], groups: [], templates: [] })
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}&limit=8`, { cache: "no-store" })
        const data = (await res.json()) as Results
        if (!cancelled) setResults(data)
      } catch {
        if (!cancelled) setResults({ users: [], groups: [], templates: [] })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [open, debounced])

  const nothing = useMemo(
    () => !loading && !results.users.length && !results.groups.length && !results.templates.length && !!debounced.trim(),
    [loading, results, debounced]
  )

  const goUser = (u: SearchUser) => {
    // Navigate to Users with a query param (adjust route if you have a dedicated page)
    router.push(`/admin/users?search=${encodeURIComponent(u.email || u.user_id)}`)
    setOpen(false)
  }
  const goGroup = (g: SearchGroup) => {
    router.push(`/admin/groups?g=${encodeURIComponent(g.id)}`)
    setOpen(false)
  }
  const goTemplate = (t: SearchTemplate) => {
    // Takes user to Template Builder with pre-selected name
    router.push(`/templates?name=${encodeURIComponent(t.name)}`)
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-xl">
      {/* Compact trigger + input that expands on focus (lives in the top rail) */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-none border border-line bg-paper px-3 py-2 text-sm",
          open ? "ring-1 ring-ink" : ""
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users, groups, templates…  ⌘K"
          className="w-full bg-transparent outline-none placeholder:text-[hsl(var(--muted-foreground))]"
        />
        {q && (
          <button
            onClick={(e) => { e.stopPropagation(); setQ(""); inputRef.current?.focus() }}
            className="text-[hsl(var(--muted-foreground))] hover:text-ink"
            aria-label="Clear"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results popover */}
      {open && (
        <Card className="absolute z-50 mt-2 w-[42rem] max-w-[90vw] rounded-none border border-line bg-paper shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading && (
              <div className="flex items-center gap-2 p-3 text-sm text-[hsl(var(--muted-foreground))]">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            )}

            {/* Users */}
            {!!results.users.length && (
              <section className="mb-2">
                <h4 className="mb-1 flex items-center gap-1 px-2 text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                  <Users className="h-3 w-3" /> Users
                </h4>
                {results.users.map((u) => {
                  const name = [u.firstname, u.lastname].filter(Boolean).join(" ").trim()
                  return (
                    <button
                      key={u.user_id}
                      onClick={() => goUser(u)}
                      className="flex w-full items-center justify-between rounded-none px-2 py-2 text-left hover:bg-[hsl(var(--muted))]"
                    >
                      <span className="truncate text-ink">{name || u.email || u.user_id}</span>
                      {u.email && <span className="ml-2 truncate text-sm text-[hsl(var(--muted-foreground))]">{u.email}</span>}
                    </button>
                  )
                })}
              </section>
            )}

            {/* Groups */}
            {!!results.groups.length && (
              <section className="mb-2">
                <h4 className="mb-1 flex items-center gap-1 px-2 text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                  <Folder className="h-3 w-3" /> Groups
                </h4>
                {results.groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => goGroup(g)}
                    className="flex w-full items-center justify-between rounded-none px-2 py-2 text-left hover:bg-[hsl(var(--muted))]"
                  >
                    <span className="truncate text-ink">{g.name}</span>
                    {g.slug && <span className="ml-2 truncate text-sm text-[hsl(var(--muted-foreground))]">{g.slug}</span>}
                  </button>
                ))}
              </section>
            )}

            {/* Templates */}
            {!!results.templates.length && (
              <section>
                <h4 className="mb-1 flex items-center gap-1 px-2 text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                  <FileText className="h-3 w-3" /> Templates
                </h4>
                {results.templates.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => goTemplate(t)}
                    className="flex w-full items-center justify-between rounded-none px-2 py-2 text-left hover:bg-[hsl(var(--muted))]"
                  >
                    <span className="truncate text-ink capitalize">{t.name}</span>
                  </button>
                ))}
              </section>
            )}

            {nothing && (
              <div className="px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                No matches for “{debounced}”
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
