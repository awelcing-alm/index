// lib/template-defaults.ts – three non‑overwritable default templates
// Uses the full NEWSLETTER_KEYS list so every newsletter slug is represented.

import { NEWSLETTER_KEYS } from "@/lib/newsletters"

export interface Template {
  name: string
  description: string
  attributes: Record<string, boolean>
  products: Record<string, boolean>
  createdAt: string
  isDefault: true
}

/* helper to start with everything false */
const allFalse = (): Record<string, boolean> =>
  Object.fromEntries(NEWSLETTER_KEYS.map((k) => [k, false]))

/* ---------------- Template: Top Content ---------------- */
const topContentAttrs = {
  ...allFalse(),
  "lawcom-leverage": true,
  "the-legal-intelligencer-weekly-case-alert": true,
  "new-jersey-law-journal-weekly-case-update": true,
  "clp-weekly-roundup": true,
  "in-the-news": true,
  "supreme-court-brief": true,
  "the-national-law-journal-morning-update": true,
  "lawcom-morning-minute": true,
  "lawcom-weekend": true,
  "legal-education-ahead-of-the-curve": true,
  "regulatory-update": true,
  "marketing-the-law-firm": true,
  "the-global-lawyer": true,
  "bench-report-your-guide-to-the-latest-judicial-news": true,
  "lawcom-barometer": true,
  "lawcom-delaware-business-court-insider-alert": true,
  "the-recorder-case-alert": true,
  "new-york-law-journal-case-update": true,
  "lawcom-newsroom-update": true,
}

/* ---------------- Template: Regional Updates ---------------- */
const regionalAttrs = {
  ...allFalse(),
  "the-legal-intelligencer-weekly-case-alert": true,
  "new-jersey-law-journal-weekly-case-update": true,
  "lawcom-new-jersey-newsroom-update": true,
  "supreme-court-brief": true,
  "lawcom-texas-newsroom-update": true,
  "lawcom-new-jersey-daily-decision-alert": true,
  "lawcom-georgia-newsroom-update": true,
  "lawcom-pennsylvania-newsroom-update": true,
  "lawcom-california-newsroom-update": true,
  "lawcom-international-morning-update": true,
  "lawcom-connecticut-newsroom-update": true,
  "the-global-lawyer": true,
  "the-recorder-case-alert": true,
  "lawcom-delaware-business-court-insider-alert": true,
  "lawcom-delaware-newsroom-update": true,
  "lawcom-newsroom-update": true,
  "lawcom-florida-newsroom-update": true,
  "lawcom-new-york-newsroom-update": true,
}

/* ---------------- Template: No Newsletters ---------------- */
const noNewsAttrs = allFalse()

export const DEFAULT_TEMPLATES: Template[] = [
  {
    name: "top-content",
    description: "Top Content newsletter bundle",
    attributes: topContentAttrs,
    products: {},
    createdAt: "",
    isDefault: true,
  },
  {
    name: "regional-updates",
    description: "Regional Updates newsletter bundle",
    attributes: regionalAttrs,
    products: {},
    createdAt: "",
    isDefault: true,
  },
  {
    name: "no-newsletters",
    description: "All newsletters turned off",
    attributes: noNewsAttrs,
    products: {},
    createdAt: "",
    isDefault: true,
  },
]
