"use client"

import React, { useEffect, useMemo, useState } from "react"
import { GroupIconInline, normalizeIconKey } from "@/components/group-icon"
import { IconGrid } from "@/components/pages/groups/IconGrid"

type ProductOption = { id: string; label: string; grantId?: string }

function slugify(s: string) { return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }

export function CreateGroupForm({ accountId, onCreated }: { accountId?: string | null; onCreated: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#0F172A")
  const [icon, setIcon] = useState<string>("folder")
  const [newsletterTemplate, setNewsletterTemplate] = useState<string>("")

  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedGrantIds, setSelectedGrantIds] = useState<string[]>([])
  const [templates, setTemplates] = useState<string[]>([])
  const [productTemplates, setProductTemplates] = useState<Record<string, string[]>>({})
  const [selectedProductTpls, setSelectedProductTpls] = useState<Record<string, string | undefined>>({})
  const [grants, setGrants] = useState<Record<string, boolean>>({})

  const [countryOpts, setCountryOpts] = useState<string[]>([])
  const [jobFunctionOpts, setJobFunctionOpts] = useState<string[]>([])
  const [jobAreaOpts, setJobAreaOpts] = useState<string[]>([])
  const [country, setCountry] = useState("")
  const [jobFunction, setJobFunction] = useState("")
  const [jobArea, setJobArea] = useState("")

  useMemo(() => new Set(selectedGrantIds), [selectedGrantIds])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        const raw = res.ok ? await res.json() : []
        const arr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
        const opts: ProductOption[] = arr.map((p: any) => ({
          id: String(p.id ?? p.productId ?? p.product_id ?? p.entitlement?.id ?? ""),
          label: String(p.label ?? p.name ?? p.title ?? p.productLabel ?? p.entitlement?.type ?? "Product"),
          grantId: p.grantId ?? p.grant_id ?? p.entitlement?.grantId ?? undefined,
        })).filter(o => !!o.id)
        if (alive) setProducts(opts)
      } catch { if (alive) setProducts([]) }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates?scope=all&format=array", { cache: "no-store" })
        const payload = await res.json().catch(() => null)
        const list: string[] = Array.isArray(payload) ? payload : Array.isArray(payload?.names) ? payload.names : Array.isArray(payload?.data) ? payload.data : []
        if (alive) setTemplates(list.filter(Boolean).sort())
      } catch { if (alive) setTemplates([]) }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const keys = ["mylaw", "radar", "compass", "scholar"]
        const qs = encodeURIComponent(keys.join(","))
        const r = await fetch(`/api/product-templates?products=${qs}`, { cache: "no-store" })
        const payload = await r.json().catch(() => null)
        if (!alive) return
        const map = (payload && payload.products) || {}
        const normalized: Record<string, string[]> = {}
        for (const k of keys) normalized[k] = Array.isArray(map[k]) ? map[k] : []
        setProductTemplates(normalized)
      } catch { if (alive) setProductTemplates({}) }
      try {
        const keys = ["mylaw", "radar", "compass", "scholar"]
        const qs = encodeURIComponent(keys.join(","))
        const r = await fetch(`/api/templates/products/grants?products=${qs}`, { cache: "no-store" })
        const p = await r.json().catch(() => ({}))
        if (!alive) return
        const g = p?.grants || {}
        setGrants({ ...g, mylaw: true })
      } catch { if (alive) setGrants({ mylaw: true }) }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/schema/users", { cache: "no-store" })
        const payload = await res.json().catch(() => null)
        const fields: any[] = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.fields) ? payload.fields : Array.isArray(payload) ? payload : []
        const optionsFor = (slug: string): string[] => {
          const f = fields.find((x) => x?.slug === slug)
          if (!f) return []
          const raw = Array.isArray(f["select-options"]) ? f["select-options"] : Array.isArray(f.options) ? f.options : Array.isArray(f.values) ? f.values : []
          return raw.map((o: any) => typeof o === "string" ? o : String((o?.value ?? o?.label ?? ""))).filter(Boolean)
        }
        if (!alive) return
        setCountryOpts(optionsFor("country").length ? optionsFor("country") : ["US","UK","CA"])
        setJobFunctionOpts(optionsFor("job-function").length ? optionsFor("job-function") : ["General Counsel","Associate","CEO","Student"])
        setJobAreaOpts(optionsFor("job-area").length ? optionsFor("job-area") : ["In-House Counsel","Technology Executive","Corporate Executive","Law Firm"])
      } catch {
        if (alive) {
          setCountryOpts(["US","UK","CA"]) ; setJobFunctionOpts(["General Counsel","Associate","CEO","Student"]) ; setJobAreaOpts(["In-House Counsel","Technology Executive","Corporate Executive","Law Firm"]) 
        }
      }
    })()
    return () => { alive = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) { setError("Group name is required"); return }

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
      headers: { "Content-Type": "application/json", ...(accountId ? { "x-account-id": accountId } : {}) },
      body: JSON.stringify(payload),
    })

    if (res.status === 400) { setError("An active account is required to manage groups."); return }
    if (!res.ok) { setError(await res.text()); return }

    onCreated()
    setName(""); setColor("#0F172A"); setIcon("folder"); setNewsletterTemplate("")
    setSelectedGrantIds([]); setCountry(""); setJobFunction(""); setJobArea("")
  }

  return (
    <section className="rounded-xl border p-4 md:p-6 bg-background">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input className="w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Litigation" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" className="h-10 w-14 cursor-pointer rounded-md border bg-transparent p-0" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Group color" />
              <input className="flex-1 rounded-md border px-3 py-2" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#0F172A" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Newsletter Template</label>
            <select className="w-full rounded-md border px-3 py-2 bg-white/5" value={newsletterTemplate} onChange={(e) => setNewsletterTemplate(e.target.value)}>
              <option value="">— Select a template —</option>
              {templates.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Templates (optional)</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {["radar","compass","scholar","mylaw"].map((k) => (
                <div key={k} className="space-y-1">
                  <div className="text-xs text-[hsl(var(--muted-foreground))] capitalize">{k}</div>
                  <select className="w-full rounded-md border px-3 py-2 bg-white/5" value={selectedProductTpls[k] || ""} onChange={(e) => setSelectedProductTpls((p) => ({ ...p, [k]: e.target.value || undefined }))} disabled={k !== "mylaw" && !grants[k]}>
                    <option value="">— None —</option>
                    {(productTemplates[k] || []).map((n) => (<option key={`${k}:${n}`} value={n}>{n}</option>))}
                  </select>
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Saved into group demographics under “product-templates”.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Products (grants)</label>
            <select multiple className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={selectedGrantIds} onChange={(e) => { const values = Array.from(e.target.selectedOptions).map((o) => o.value); setSelectedGrantIds(values) }}>
              {products.map((p) => { const value = p.grantId ?? p.id; const label = p.label || "Product"; return (<option key={`${p.id}-${value}`} value={value}>{label}</option>) })}
            </select>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]"><span>Hold </span><kbd>Ctrl</kbd>/<kbd>Cmd</kbd><span> to select multiple.</span></p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Group Icon</label>
          <IconGrid value={icon} onChange={setIcon} color={color} />
        </div>

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
          <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2">Create Group</button>
          <button type="reset" onClick={() => { setName(""); setColor("#0F172A"); setIcon("folder"); setNewsletterTemplate(""); setSelectedGrantIds([]); setCountry(""); setJobFunction(""); setJobArea(""); setError(null) }} className="rounded-md border px-4 py-2">Cancel</button>
        </div>
      </form>
    </section>
  )
}
