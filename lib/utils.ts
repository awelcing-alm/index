import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Stable stringify for object hashing (order-insensitive, prunes cycles)
export function stableStringify(obj: unknown): string {
  const seen = new WeakSet()
  return JSON.stringify(obj, function (_key, value) {
    if (value && typeof value === "object") {
      if (seen.has(value as object)) return
      seen.add(value as object)
      const out: Record<string, unknown> = {}
      for (const k of Object.keys(value as Record<string, unknown>).sort()) {
        out[k] = (value as any)[k]
      }
      return out
    }
    return value
  })
}

// Lightweight deterministic hash (FNV-ish) suitable for fingerprints client/server
function tinyHash(input: string): string {
  let h1 = 0x811c9dc5 >>> 0
  let h2 = 0x1000193 >>> 0
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    h1 ^= c; h1 = Math.imul(h1, 0x01000193) >>> 0
    h2 = (h2 + c + ((h2 << 1) >>> 0) + ((h2 << 4) >>> 0) + ((h2 << 7) >>> 0) + ((h2 << 8) >>> 0) + ((h2 << 24) >>> 0)) >>> 0
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0"))
}

export function fingerprintAttributes(payload: Record<string, any>): string {
  return tinyHash(stableStringify(payload || {}))
}
