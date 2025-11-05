"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { getActiveAccountId } from "@/lib/account-store"
import { GroupIconInline, normalizeIconKey } from "@/components/group-icon"
import { ApplyTemplatesModal } from "@/components/templates/apply-templates-modal.v2"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

/** Curated icon keys (still using the *new* icon renderer). */
const ICON_CHOICES: string[] = [
  "scale",
  "bank",
  "clipboard",
  "shield",
  "user",
  "users",
  "briefcase",
  "file",
  "chart",
  "pie",
  "gavel",
  "building",
  "folder",
  "book",
]

// util
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

/** Grid-style icon selector to match the old layout */
function IconGrid({
  value,
  onChange,
  color,
}: {
  value: string
  onChange: (next: string) => void
  color?: string | null
}) {
  return (
    <div className="rounded-md border p-3 bg-[hsl(var(--muted))]/10">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="select-none">Current:</span>
        <GroupIconInline
          icon={value}
          color={color ?? undefined}
          className="h-5 w-5"
          title="Current icon"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {ICON_CHOICES.map((key) => {
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-pressed={selected}
              className={[
                "flex h-14 items-center justify-center rounded-md border transition-colors",
                "bg-white/50 hover:bg-[hsl(var(--muted))]/30",
                selected
                  ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500"
                  : "border-[hsl(var(--border))]",
              ].join(" ")}
              title={key}
            >
              <GroupIconInline
                icon={key}
                color={color ?? undefined}
                className="h-6 w-6"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function GroupManagerPage() {
  const accountId = getActiveAccountId()

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsAccount, setNeedsAccount] = useState(false)
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyGroupId, setApplyGroupId] = useState<string | null>(null)
  const [savedStacks, setSavedStacks] = useState<Array<{ name: string; list: string[] }>>([])
  const [initialStack, setInitialStack] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    try { const raw = localStorage.getItem("template_stacks"); const arr = raw ? JSON.parse(raw) : []; if (Array.isArray(arr)) setSavedStacks(arr) } catch {}
  }, [])

  // form
  const [name, setName] = useState("")
  const [color, setColor] = useState("#0F172A")
  const [icon, setIcon] = useState<string>("folder")
  const [newsletterTemplate, setNewsletterTemplate] = useState<string>("")

  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedGrantIds, setSelectedGrantIds] = useState<string[]>([])
  const [templates, setTemplates] = useState<string[]>([])
  const [productTemplates, setProductTemplates] = useState<{ radar: string[]; compass: string[]; scholar: string[]; mylaw: string[] }>({ radar: [], compass: [], scholar: [], mylaw: [] })
  const [selectedProductTpls, setSelectedProductTpls] = useState<{ radar?: string; compass?: string; scholar?: string; mylaw?: string }>({})
  const [grants, setGrants] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean }>({})

  const [countryOpts, setCountryOpts] = useState<string[]>([])
  const [jobFunctionOpts, setJobFunctionOpts] = useState<string[]>([])
  const [jobAreaOpts, setJobAreaOpts] = useState<string[]>([])
  const [country, setCountry] = useState("")
  const [jobFunction, setJobFunction] = useState("")
  const [jobArea, setJobArea] = useState("")

  useMemo(() => new Set(selectedGrantIds), [selectedGrantIds]) // keeps react quiet

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNeedsAccount(false)

    try {
      const res = await fetch("/api/groups", {
        cache: "no-store",
        headers: accountId ? { "x-account-id": accountId } : undefined,
      })

      if (res.status === 400) {
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
  }, [accountId])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  // products
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/products ${res.status}`)
        const raw = await res.json()
        const arr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
        const opts: ProductOption[] = arr.map((p: any) => ({
          id: String(p.id ?? p.productId ?? p.product_id ?? p.entitlement?.id ?? ""),
          label: String(p.label ?? p.name ?? p.title ?? p.productLabel ?? p.entitlement?.type ?? "Product"),
          grantId: p.grantId ?? p.grant_id ?? p.entitlement?.grantId ?? undefined,
        })).filter(o => !!o.id)
        if (alive) setProducts(opts)
      } catch {
        if (alive) setProducts([])
      }
    })()
    return () => { alive = false }
  }, [])

  // template names (supports both old `{ ok, names }` and new array shapes)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // Ask for array if your API supports it; otherwise we parse flexibly below.
        const res = await fetch("/api/templates?scope=all&format=array", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/templates ${res.status}`)
        const payload = await res.json()
        const list: string[] =
          Array.isArray(payload) ? payload :
          Array.isArray(payload?.names) ? payload.names :
          Array.isArray(payload?.data) ? payload.data : []

        if (alive) setTemplates(list.filter(Boolean).sort())
      } catch {
        if (alive) setTemplates([])
      }
    })()
    return () => { alive = false }
  }, [])

  // fetch product templates (best-effort)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [radar, compass, scholar, mylaw] = await Promise.all([
          fetch("/api/product-templates/radar", { cache: "no-store" }).then(r => r.ok ? r.json() : []),
          fetch("/api/product-templates/compass", { cache: "no-store" }).then(r => r.ok ? r.json() : []),
          fetch("/api/product-templates/scholar", { cache: "no-store" }).then(r => r.ok ? r.json() : []),
          fetch("/api/product-templates/mylaw", { cache: "no-store" }).then(r => r.ok ? r.json() : []),
        ])
        if (!alive) return
        setProductTemplates({
          radar: (Array.isArray(radar) ? radar : []).filter(Boolean).sort(),
          compass: (Array.isArray(compass) ? compass : []).filter(Boolean).sort(),
          scholar: (Array.isArray(scholar) ? scholar : []).filter(Boolean).sort(),
          mylaw: (Array.isArray(mylaw) ? mylaw : []).filter(Boolean).sort(),
        })
      } catch {
        if (!alive) return
        setProductTemplates({ radar: [], compass: [], scholar: [], mylaw: [] })
      }
    })()
    return () => { alive = false }
  }, [])

  // fetch account product grants to gate template pickers (MyLaw always available)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates/products/grants", { cache: "no-store" })
        const p = await res.json().catch(() => ({}))
        if (!alive) return
        const g = p?.grants || {}
        setGrants({ radar: !!g.radar, compass: !!g.compass, scholar: !!g.scholar, mylaw: true })
      } catch {
        if (!alive) setGrants({ radar: false, compass: false, scholar: false, mylaw: true })
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
            .map((o: unknown) => {
              if (typeof o === "string") return o
              const v = (o as any)?.value ?? (o as any)?.label ?? ""
              return String(v || "")
            })
            .filter(Boolean)
        }

        if (!alive) return
        const countries = optionsFor("country")
        const jobFns = optionsFor("job-function")
        const jobAreas = optionsFor("job-area")

        setCountryOpts(countries.length ? countries : ["US", "UK", "CA"])
        setJobFunctionOpts(jobFns.length ? jobFns : ["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(jobAreas.length ? jobAreas : ["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm"])
      } catch {
        if (!alive) return
        setCountryOpts(["US", "UK", "CA"])
        setJobFunctionOpts(["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm"])
      }
    })()
    return () => { alive = false }
  }, [])

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
      icon: normalizeIconKey(icon),
      default_template: newsletterTemplate || null,
      product_grant_ids: selectedGrantIds,
      demographics: {
        ...(country     ? { "country": country } : {}),
        ...(jobFunction ? { "job-function": jobFunction } : {}),
        ...(jobArea     ? { "job-area": jobArea } : {}),
        ...(Object.keys(selectedProductTpls).length ? { "product-templates": selectedProductTpls } : {}),
      },
    }

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accountId ? { "x-account-id": accountId } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (res.status === 400) { setNeedsAccount(true); return }
    if (!res.ok) { setError(await res.text()); return }

    await fetchGroups()
    setName(""); setColor("#0F172A"); setIcon("folder"); setNewsletterTemplate("")
    setSelectedGrantIds([]); setCountry(""); setJobFunction(""); setJobArea("")
  }

  const deleteOne = async (g: Group) => {
    const res = await fetch(`/api/groups?slug=${encodeURIComponent(g.slug)}`, {
      method: "DELETE",
      headers: accountId ? { "x-account-id": accountId } : undefined,
    })
    if (!res.ok) { setError(await res.text()); return }
    fetchGroups()
  }

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
          <p className="text-red-600 font-medium">An active account is required to manage groups.</p>
          <p className="text-muted-foreground mt-1">Use the account switcher in the header to select an account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground">Dashboard › Groups</nav>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
            <p className="text-muted-foreground">
              Create groups and manage templates, product grants, and demographics.
            </p>
          </div>
          <a
            href="/analytics/groups"
            className="hidden rounded-none border border-line px-3 py-1 text-sm text-ink hover:bg-[hsl(var(--muted))] md:inline-block"
          >
            Open Group Usage
          </a>
        </div>
      </div>

      {/* Create */}
      <section className="rounded-xl border p-4 md:p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}

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

            {/* Product templates (optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Product Templates (optional)</label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {(["radar","compass","scholar","mylaw"] as const).map((k) => (
                  <div key={k} className="space-y-1">
                    <div className="text-xs text-[hsl(var(--muted-foreground))] capitalize">{k}</div>
                    <select
                      className="w-full rounded-md border px-3 py-2 bg-white/5"
                      value={selectedProductTpls[k] || ""}
                      onChange={(e) => setSelectedProductTpls((p) => ({ ...p, [k]: e.target.value || undefined }))}
                      disabled={k !== "mylaw" && !grants[k]}
                    >
                      <option value="">— None —</option>
                      {productTemplates[k].map((n) => (
                        <option key={`${k}:${n}`} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Saved into group demographics under “product-templates”.</p>
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
                  const label = p.label || "Product"
                  return (
                    <option key={`${p.id}-${value}`} value={value}>
                      {label}
                    </option>
                  )
                })}
              </select>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                Hold <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> to select multiple.
              </p>
            </div>
          </div>

          {/* Icon selector (grid layout) */}
          <div>
            <label className="block text-sm font-medium mb-2">Group Icon</label>
            <IconGrid
              value={icon}
              onChange={(next) => setIcon(next)}
              color={color}
            />
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <select className="w-full rounded-md border px-3 py-2" value={country} onChange={(e) => setCountry(e.target.value)}>
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
                setName(""); setColor("#0F172A"); setIcon("folder"); setNewsletterTemplate("")
                setSelectedGrantIds([]); setCountry(""); setJobFunction(""); setJobArea("")
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
          {savedStacks.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Stacks:</span>
              {savedStacks.map((p) => {
                const tip = (p.list || []).slice(0,6).join(" + ") + ((p.list || []).length>6?" + …":"")
                return (
                  <TooltipProvider key={p.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => { setInitialStack(p.list); setApplyOpen(true) }} className="rounded-none border border-line px-2 py-1 text-sm hover:bg-[hsl(var(--muted))]">{p.name}</button>
                      </TooltipTrigger>
                      <TooltipContent className="rounded-none border-line bg-paper text-ink">{tip || "(empty)"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          )}
        </div>

        {loading && <p>Loading groups…</p>}
        {!loading && groups.length === 0 && <p className="text-muted-foreground">No groups yet.</p>}
        {!loading && groups.length > 0 && (
          <ul className="divide-y rounded-md border">
            {groups.map((g) => (
              <li key={g.slug} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <GroupIconInline icon={g.icon} color={g.color ?? undefined} title={g.name} className="h-5 w-5" />
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
                    onClick={() => { setApplyGroupId(g.id); setApplyOpen(true) }}
                    className="rounded-none border border-line px-2 py-1 text-sm text-ink hover:bg-[hsl(var(--muted))]"
                    title="Apply templates to group members"
                  >
                    Apply Templates…
                  </button>
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

      {/* Apply Templates to Group modal */}
      <ApplyTemplatesModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        target={{ type: "group", ids: applyGroupId ? [applyGroupId] : [] }}
        initialStack={initialStack}
        onApplied={({ wrote }) => {
          toast({ title: "Group apply complete", description: `${wrote} field${wrote === 1 ? "" : "s"} written.` })
          setApplyOpen(false)
          setInitialStack(undefined)
        }}
      />
    </div>
  )
}
