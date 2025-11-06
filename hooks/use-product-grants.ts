"use client"

import { useEffect, useState } from "react"

export function useProductGrants() {
  const [productGrants, setProductGrants] = useState<Record<string, boolean> | null>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates/products/grants", { cache: "no-store", headers: { Accept: "application/json" } })
        const payload = await res.json().catch(() => ({}))
        if (!alive) return
        const g = payload?.grants || {}
        setProductGrants({ ...(g || {}), mylaw: true })
      } catch {
        if (alive) setProductGrants({ mylaw: true })
      }
    })()
    return () => { alive = false }
  }, [])
  return productGrants
}
