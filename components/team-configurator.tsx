// components/team-configurator.tsx
"use client"

import { useEffect, useState } from "react"
import type { Team } from "@/lib/teams"

/** Product option returned by /api/products (normalized) */
type ProductOption = {
  id: string
  label: string
  grantId?: string
}

type Initial = Pick<
  Team,
  "id" | "name" | "color" | "icon" | "default_template" | "product_grant_ids" | "demographics"
>

type Props = {
  onCreated?: () => void
  /** If provided, the form is in “edit” mode and starts with these values */
  initial?: Initial
}

const ICONS = [
  "scale", "bank", "clipboard", "shield", "user", "users", "briefcase",
  "file", "chart", "pie", "gavel", "building", "folder", "book"
]

const ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function TeamConfigurator({ onCreated, initial }: Props) {
  // ---- base fields
  const [name, setName] = useState(initial?.name ?? "")
  const [color, setColor] = useState(initial?.color ?? "#0F172A")
  const [icon, setIcon] = useState<string>(initial?.icon ?? "scale")
  // UI label says "Newsletter Template", but we keep the stored field name
  const [newsletterTemplate, setNewsletterTemplate] = useState(initial?.default_template ?? "")

  // ---- products (grant IDs)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedGrantIds, setSelectedGrantIds] = useState<string[]>(initial?.product_grant_ids ?? [])

  // ---- templates list
  const [templateNames, setTemplateNames] = useState<string[]>([])

  // ---- schema-driven demographics
  const initDemo = (initial?.demographics ?? {}) as Record<string, any>
  const [region, setRegion] = useState<string>(initDemo.region ?? "") // maps to Zephr "country"
  const [jobFunction, setJobFunction] = useState<string>(initDemo.job_function ?? "")
  const [jobArea, setJobArea] = useState<string>(initDemo.job_area ?? "") // “Job Title” → Zephr job-area

  const [countryOpts, setCountryOpts] = useState<string[]>([])
  const [jobFunctionOpts, setJobFunctionOpts] = useState<string[]>([])
  const [jobAreaOpts, setJobAreaOpts] = useState<string[]>([])

  // ---- status
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // refresh if `initial` changes
  useEffect(() => {
    if (!initial) return
    setName(initial.name ?? "")
    setColor(initial.color ?? "#0F172A")
    setIcon(initial.icon ?? "scale")
    setNewsletterTemplate(initial.default_template ?? "")
    setSelectedGrantIds(initial.product_grant_ids ?? [])
    const d = (initial.demographics ?? {}) as Record<string, any>
    setRegion(d.region ?? "")
    setJobFunction(d.job_function ?? "")
    setJobArea(d.job_area ?? "")
  }, [initial])

  // ---------- LOADERS ----------

  // PRODUCTS (robust normalization + safe error)
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/products ${res.status}`)
        const raw = await res.json()

        const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
        const opts: ProductOption[] = arr
          .map((p: any) => ({
            id: String(p.id ?? p.productId ?? p.product_id ?? p.entitlement?.id ?? ""),
            label: String(p.label ?? p.name ?? p.title ?? p.productLabel ?? p.entitlement?.type ?? "Product"),
            grantId: p.grantId ?? p.grant_id ?? p.entitlement?.grantId ?? undefined,
          }))
          .filter((o: { id: any }) => o.id)

        if (!active) return
        setProducts(opts)
      } catch (e) {
        console.error("[TeamConfigurator] Failed to load products", e)
        if (!active) return
        setProducts([])
      }
    })()
    return () => { active = false }
  }, [])

  // TEMPLATES
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/templates ${res.status}`)
        const names = await res.json()
        if (!active) return
        const list = (Array.isArray(names) ? names : Array.isArray(names?.data) ? names.data : []) as string[]
        setTemplateNames(list.filter(Boolean).sort())
      } catch (e) {
        console.error("[TeamConfigurator] Failed to load templates", e)
        if (!active) return
        setTemplateNames([])
      }
    })()
    return () => { active = false }
  }, [])

  // USER SCHEMA (country, job-function, job-area) with resilient shapes + fallbacks
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/schema/users", { cache: "no-store" })
        if (!res.ok) throw new Error(`GET /api/schema/users ${res.status}`)
        const payload = await res.json()

        const fields: any[] =
          Array.isArray(payload?.data) ? payload.data :
          Array.isArray(payload?.fields) ? payload.fields :
          Array.isArray(payload) ? payload :
          []

        const optionsFor = (slug: string): string[] => {
          const f = fields.find((x) => x?.slug === slug)
          if (!f) return []
          const raw =
            Array.isArray(f["select-options"]) ? f["select-options"] :
            Array.isArray(f.options) ? f.options :
            Array.isArray(f.values) ? f.values :
            []
          return raw
            .map((o: any) => (typeof o === "string" ? o : (o?.value ?? o?.label ?? "") + ""))
            .filter(Boolean)
        }

        const countries = optionsFor("country")
        const jobFns = optionsFor("job-function")
        const jobAreas = optionsFor("job-area")

        if (!active) return
        setCountryOpts(countries.length ? countries : ["United States", "Canada", "United Kingdom"])
        setJobFunctionOpts(jobFns.length ? jobFns : ["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(jobAreas.length ? jobAreas : ["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm", "Solo Practitioner"])
      } catch (e) {
        console.error("[TeamConfigurator] Failed to load user schema", e)
        if (!active) return
        // Hard fallbacks: dropdowns still usable if API is down/empty
        setCountryOpts(["United States", "Canada", "United Kingdom"])
        setJobFunctionOpts(["General Counsel", "Associate", "CEO", "Student"])
        setJobAreaOpts(["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm", "Solo Practitioner"])
      }
    })()
    return () => { active = false }
  }, [])

  // ---------- HANDLERS ----------
  const handleProductsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value)
    setSelectedGrantIds(values)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError("Team name is required")
      return
    }

    // If editing, keep the existing id; otherwise slugify the new name
    const idToUse = initial?.id ?? slugify(name)
    const slug = idToUse

    const payload = {
      id: idToUse,
      slug,
      name: name.trim(),
      color: color || null,
      icon: icon || null,
      // store under the same field name your backend expects
      default_template: newsletterTemplate || null,
      // IMPORTANT: we persist *grant IDs* here
      product_grant_ids: selectedGrantIds,
      demographics: {
        ...(region ? { region } : {}), // maps to Zephr "country"
        ...(jobFunction ? { job_function: jobFunction } : {}),
        ...(jobArea ? { job_area: jobArea } : {}),
      },
    }

    try {
      setLoading(true)
      const res = await fetch("/api/teams", {
        method: "POST", // upsert on the API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())

      setSuccess(initial ? "Team updated" : "Team created")
      onCreated?.()

      if (!initial) {
        // reset only in create mode
        setName("")
        setColor("#0F172A")
        setIcon("scale")
        setNewsletterTemplate("")
        setSelectedGrantIds([])
        setRegion("")
        setJobFunction("")
        setJobArea("")
      }
    } catch (err: any) {
      console.error("[TeamConfigurator] save failed", err)
      setError(err?.message ?? "Save failed")
    } finally {
      setLoading(false)
    }
  }

  // ---------- UI ----------
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team name */}
        <div>
          <label className="block text-sm font-medium mb-1">Team Name</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Litigation"
          />
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-10 w-14 cursor-pointer rounded-md border bg-transparent p-0"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Team color"
            />
            <input
              className="flex-1 rounded-md border px-3 py-2"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#0F172A"
            />
          </div>
        </div>

        {/* Newsletter template */}
        <div>
          <label className="block text-sm font-medium mb-1">Newsletter Template</label>
          <select
            className="w-full rounded-md border px-3 py-2 bg-white/5"
            value={newsletterTemplate}
            onChange={(e) => setNewsletterTemplate(e.target.value)}
          >
            <option value="">— Select a template —</option>
            {templateNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Products (Grant IDs) */}
        <div>
          <label className="block text-sm font-medium mb-1">Products (grants)</label>
          <select
            multiple
            className="w-full rounded-md border px-3 py-2 min-h-[120px]"
            value={selectedGrantIds}
            onChange={handleProductsChange}
          >
            {products.map((p) => {
              // We *save* the grantId; if absent, fall back to product id
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

          {/* Selected chips (preview) */}
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

      {/* Icon selector (simple pop grid) */}
      <div>
        <label className="block text-sm font-medium mb-2">Team Icon</label>
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

      {/* Demographics (schema-driven) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Region (maps to Zephr country) */}
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">— Select country —</option>
            {countryOpts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Job Function (Zephr: job-function) */}
        <div>
          <label className="block text-sm font-medium mb-1">Job Function</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={jobFunction}
            onChange={(e) => setJobFunction(e.target.value)}
          >
            <option value="">— Select job function —</option>
            {jobFunctionOpts.map((jf) => (
              <option key={jf} value={jf}>{jf}</option>
            ))}
          </select>
        </div>

        {/* Job Title → use Zephr "job-area" options */}
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={jobArea}
            onChange={(e) => setJobArea(e.target.value)}
          >
            <option value="">— Select job area —</option>
            {jobAreaOpts.map((ja) => (
              <option key={ja} value={ja}>{ja}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? (initial ? "Saving…" : "Creating…") : (initial ? "Save Changes" : "Create Team")}
        </button>
        <button
          type="reset"
          onClick={() => {
            if (initial) {
              setName(initial.name ?? "")
              setColor(initial.color ?? "#0F172A")
              setIcon(initial.icon ?? "scale")
              setNewsletterTemplate(initial.default_template ?? "")
              setSelectedGrantIds(initial.product_grant_ids ?? [])
              const d = (initial.demographics ?? {}) as Record<string, any>
              setRegion(d.region ?? ""); setJobFunction(d.job_function ?? ""); setJobArea(d.job_area ?? "")
            } else {
              setName(""); setColor("#0F172A"); setIcon("scale"); setNewsletterTemplate("")
              setSelectedGrantIds([]); setRegion(""); setJobFunction(""); setJobArea("")
            }
            setError(null); setSuccess(null)
          }}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
