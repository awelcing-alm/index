// components/pages/group-manager-page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Group = {
  account_id: string
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template: string | null
  product_grant_ids: string[]
  demographics: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

type ProductOption = { id: string; label: string; grantId?: string }

const ICONS = [
  "scale", "bank", "clipboard", "shield", "user", "users", "briefcase",
  "file", "chart", "pie", "gavel", "building", "folder", "book"
] as const

const ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function GroupManagerPage() {
  // list state
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsAccount, setNeedsAccount] = useState(false)

  // form state
  const [name, setName] = useState("")
  const [color, setColor] = useState("#0F172A")
  const [icon, setIcon] = useState<string>("scale")
  const [newsletterTemplate, setNewsletterTemplate] = useState<string>("")

  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedGrantIds, setSelectedGrantIds] = useState<string[]>([])
  const [templates, setTemplates] = useState<string[]>([])

  const [countryOpts, setCountryOpts] = useState<string[]>([])
  const [jobFunctionOpts, setJobFunctionOpts] = useState<string[]>([])
  const [jobAreaOpts, setJobAreaOpts] = useState<string[]>([])

  const [region, setRegion] = useState("")
  const [jobFunction, setJobFunction] = useState("")
  const [jobArea, setJobArea] = useState("")

  // ---- LOADERS -----------------------------------------------------

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNeedsAccount(false)
    try {
      const res = await fetch("/api/groups", { cache: "no-store" })
      if (res.status === 400) { // API returns 400 when no active account cookie
        setNeedsAccount(true)
        setGroups([])
        return
      }
      if (!res.ok) throw new Error(await res.text())
      const data: Group[] = await res.json()
      setGroups(data)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load groups")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  // products (via your existing API)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/products ${res.status}`)
        const raw = await res.json()
        const arr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
        const opts: ProductOption[] = arr
          .map((p: any) => ({
            id: String(p.id ?? p.productId ?? p.product_id ?? p.entitlement?.id ?? ""),
            label: String(p.label ?? p.name ?? p.title ?? p.productLabel ?? p.entitlement?.type ?? "Product"),
            grantId: p.grantId ?? p.grant_id ?? p.entitlement?.grantId ?? undefined,
          }))
          .filter(o => !!o.id)
        if (alive) setProducts(opts)
      } catch {
        if (alive) setProducts([])
      }
    })()
    return () => { alive = false }
  }, [])

  // templates
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/templates ${res.status}`)
        const names = await res.json()
        const list = (Array.isArray(names) ? names : Array.isArray(names?.data) ? names.data : []) as string[]
        if (alive) setTemplates(list.filter(Boolean).sort())
      } catch {
        if (alive) setTemplates([])
      }
    })()
    return () => { alive = false }
  }, [])

  // user schema (country, job-function, job-area)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/schema/users", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/schema/users ${res.status}`)
        const payload = await res.json()
        const fields: any[] =
          Array.isArray(payload?.data) ? payload.data :
          Array.isArray(payload?.fields) ? payload.fields :
          Array.isArray(payload) ? payload : []

        const optionsFor = (slug: string): string[] => {
          const f = fields.find((x) => x?.slug === slug)
          if (!f) return []
          const raw =
            Array.isArray(f["select-options"]) ? f["select-options"] :
            Array.isArray(f.options) ? f.options :
            Array.isArray(f.values) ? f.values : []
          return raw
            .map((o: unknown) => typeof o === "string" ? o : String((o as any)?.value ?? (o as any)?.label ?? ""))
            .filter(Boolean)
        }

        if (!alive) return
        const countries = optionsFor("country")
        const jobFns = optionsFor("job-function")
        const jobAreas = optionsFor("job-area")

        setCountryOpts(countries.length ? countries : ["United States", "Canada", "United Kingdom"])
        setJobFunctionOpts(jobFns.length ? jobFns : ["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(jobAreas.length ? jobAreas : ["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm", "Solo Practitioner"])
      } catch {
        if (!alive) return
        setCountryOpts(["United States", "Canada", "United Kingdom"])
        setJobFunctionOpts(["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm", "Solo Practitioner"])
      }
    })()
    return () => { alive = false }
  }, [])

  // ---- HANDLERS ----------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Group name is required")
      return
    }

    const payload = {
      name: name.trim(),
      slug: slugify(name),
      color: color || null,
      icon: icon || null,
      default_template: newsletterTemplate || null,
      product_grant_ids: selectedGrantIds,
      demographics: {
        ...(region ? { region } : {}),
        ...(jobFunction ? { job_function: jobFunction } : {}),
        ...(jobArea ? { job_area: jobArea } : {}),
      },
    }

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.status === 400) {
        setNeedsAccount(true)
        return
      }
      if (!res.ok) throw new Error(await res.text())

      // success — refresh list & reset the form
      await fetchGroups()
      setName("")
      setColor("#0F172A")
      setIcon("scale")
      setNewsletterTemplate("")
      setSelectedGrantIds([])
      setRegion("")
      setJobFunction("")
      setJobArea("")
    } catch (err: any) {
      setError(err?.message ?? "Failed to create group")
    }
  }

  const deleteOne = async (g: Group) => {
    try {
      const res = await fetch(`/api/groups?slug=${encodeURIComponent(g.slug)}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      fetchGroups()
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete group")
    }
  }

  // ---- RENDER ------------------------------------------------------

  if (needsAccount) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <nav className="text-sm text-muted-foreground">Dashboard › Groups</nav>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Create groups and manage templates, product grants, and demographics.
          </p>
        </div>
        <div className="rounded-xl border p-6 bg-background">
          <p className="text-red-600 font-medium">
            An active account is required to manage groups.
          </p>
          <p className="text-muted-foreground mt-1">
            Use the account switcher in the header to select an account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground">Dashboard › Groups</nav>
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground">
          Create groups and manage templates, product grants, and demographics.
        </p>
      </div>

      {/* Create */}
      <section className="rounded-xl border p-4 md:p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        {error && (
          <Alert className="mb-3 rounded-none border border-line bg-[hsl(var(--muted))]">
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Group Name</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Litigation"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-14 cursor-pointer rounded-md border bg-transparent p-0"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  aria-label="Group color"
                />
                <input
                  className="flex-1 rounded-md border px-3 py-2"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#0F172A"
                />
              </div>
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium mb-1">Newsletter Template</label>
              <select
                className="w-full rounded-md border px-3 py-2 bg-white/5"
                value={newsletterTemplate}
                onChange={(e) => setNewsletterTemplate(e.target.value)}
              >
                <option value="">— Select a template —</option>
                {templates.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Products */}
            <div>
              <label className="block text-sm font-medium mb-1">Products (grants)</label>
              <select
                multiple
                className="w-full rounded-md border px-3 py-2 min-h-[120px]"
                value={selectedGrantIds}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions).map((o) => o.value)
                  setSelectedGrantIds(values)
                }}
              >
                {products.map((p) => {
                  const value = p.grantId ?? p.id
                  const label = p.label || p.id
                  return (
                    <option key={`${p.id}-${value}`} value={value}>
                      {label} — {value}
                    </option>
                  )
                })}
              </select>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                Hold <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> to select multiple.
              </p>

              {selectedGrantIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedGrantIds.map((gid) => {
                    const p = products.find((x) => (x.grantId ?? x.id) === gid)
                    return (
                      <span
                        key={gid}
                        className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-800"
                        title={gid}
                      >
                        {(p?.label || "Grant")}: {gid.slice(0, 8)}…
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Group Icon</label>
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer select-none text-sm">
                Current: <span className="ml-1">{ICON_EMOJI[icon] ?? "🔹"}</span>
              </summary>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {ICONS.map((key) => {
                  const isSelected = icon === key
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setIcon(key)}
                      className={[
                        "h-12 rounded-md border flex items-center justify-center",
                        isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      ].join(" ")}
                      title={key}
                    >
                      <span className="text-xl leading-none">{ICON_EMOJI[key] ?? "🔹"}</span>
                    </button>
                  )
                })}
              </div>
            </details>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select className="w-full rounded-md border px-3 py-2" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">— Select country —</option>
                {countryOpts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Function</label>
              <select className="w-full rounded-md border px-3 py-2" value={jobFunction} onChange={(e) => setJobFunction(e.target.value)}>
                <option value="">— Select job function —</option>
                {jobFunctionOpts.map((jf) => <option key={jf} value={jf}>{jf}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <select className="w-full rounded-md border px-3 py-2" value={jobArea} onChange={(e) => setJobArea(e.target.value)}>
                <option value="">— Select job area —</option>
                {jobAreaOpts.map((ja) => <option key={ja} value={ja}>{ja}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2">
              Create Group
            </button>
            <button
              type="reset"
              onClick={() => {
                setName(""); setColor("#0F172A"); setIcon("scale"); setNewsletterTemplate("")
                setSelectedGrantIds([]); setRegion(""); setJobFunction(""); setJobArea("")
                setError(null)
              }}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="rounded-xl border p-4 md:p-6 bg-background">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Existing Groups</h2>
        </div>

        {loading && <p>Loading groups…</p>}
        {!loading && groups.length === 0 && <p className="text-muted-foreground">No groups yet.</p>}
        {!loading && groups.length > 0 && (
          <ul className="divide-y rounded-md border">
            {groups.map((g) => (
              <li key={g.slug} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ICON_EMOJI[String(g.icon) || ""] ?? "🔹"}</span>
                  <div>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-muted-foreground">slug: {g.slug}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!!g.color && (
                    <span className="inline-flex h-5 w-5 rounded border" style={{ background: g.color }} />
                  )}
                  <button
                    onClick={() => deleteOne(g)}
                    className="text-red-600 hover:underline"
                    title="Delete group"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
