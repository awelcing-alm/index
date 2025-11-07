import "server-only"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"

export type NamedTemplate = {
  name: string
  attributes: Record<string, any>
  overwrite_false?: boolean | null
}

export type MergeResult = {
  result: Record<string, any>
  /**
   * For each key, the list of contributors that determined the final value.
   * - For booleans ending true → only templates that set true (last writer wins)
   * - For booleans ending false via overwrite_false → the last template that forced false
   * - For booleans ending false without overwrite_false → first template setting false (if no later true)
   * - For non-booleans → the last template that set the value
   * - If base provided and its value survives → includes "baseUser"
   */
  sources: Record<string, string[]>
}

const isBoolishTrue = (v: any) => v === true || v === "true" || v === 1 || v === "1"
const isBoolishFalse = (v: any) => v === false || v === "false" || v === 0 || v === "0"

/**
 * Merge newsletter-oriented templates.
 * - Boolean keys (in NEWSLETTER_KEYS): OR semantics by default
 * - overwrite_false: if template sets a key strictly false AND overwrite_false=true, it forces false
 *   unless a later template sets true
 * - Non-boolean keys: last-wins
 */
export function mergeTemplates(templates: NamedTemplate[], base?: Record<string, any>): MergeResult {
  const baseSafe: Record<string, any> = base && typeof base === "object" ? { ...base } : {}
  const result: Record<string, any> = {}
  const sources: Record<string, string[]> = {}

  const newsletterSet = new Set<string>(NEWSLETTER_KEYS as unknown as string[])

  // Normalize base newsletter booleans to true/false
  for (const k of Object.keys(baseSafe)) {
    if (newsletterSet.has(k)) {
      const v = baseSafe[k]
      if (isBoolishTrue(v)) baseSafe[k] = true
      else if (isBoolishFalse(v)) baseSafe[k] = false
      else delete baseSafe[k]
    }
  }

  // Track contributors precisely per key
  const contrib: Record<string, Set<string>> = {}
  const add = (k: string, who: string) => {
    if (!contrib[k]) contrib[k] = new Set<string>()
    contrib[k]!.add(who)
  }
  const clear = (k: string) => { if (contrib[k]) contrib[k]!.clear() }

  // Seed with base
  for (const [k, v] of Object.entries(baseSafe)) {
    result[k] = v
    add(k, "baseUser")
  }

  for (const tpl of templates) {
    const name = tpl.name
    const attrs = tpl.attributes || {}
    const overwriteFalse = !!tpl.overwrite_false

    for (const [k, v] of Object.entries(attrs)) {
      if (newsletterSet.has(k)) {
        const valTrue = isBoolishTrue(v)
        const valFalse = isBoolishFalse(v)

        if (valTrue) {
          // true wins immediately; reset provenance to this template only
          result[k] = true
          clear(k)
          add(k, name)
        } else if (valFalse) {
          // Set/force false only if not currently true
          if (overwriteFalse && result[k] !== true) {
            result[k] = false
            clear(k)
            add(k, name)
          } else if (!(k in result)) {
            result[k] = false
            clear(k)
            add(k, name)
          }
          // If current is true, ignore false contributor; it didn't affect final
        }
      } else {
        // Non-boolean: last-wins with single contributor
        result[k] = v
        clear(k)
        add(k, name)
      }
    }
  }

  // finalize sources
  for (const [k, set] of Object.entries(contrib)) {
    sources[k] = Array.from(set)
  }

  return { result, sources }
}
