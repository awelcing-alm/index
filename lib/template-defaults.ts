// lib/template-defaults.ts  – three non-overwritable default templates

import { NEWSLETTER_KEYS } from "@/lib/newsletters"

/* ------------------------------------------------------------------ */
/* Shared types                                                       */
/* ------------------------------------------------------------------ */

export interface Template {
  name: string
  description: string
  attributes: Record<string, boolean>
  overwriteFalse: boolean        // NEW – controls “set others to false”
  createdAt: string              // ISO for dashboards / sort
  updatedAt?: string             // defaults omitted on hard-coded items
  isDefault: true
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const allFalse = (): Record<string, boolean> =>
  Object.fromEntries(NEWSLETTER_KEYS.map((k) => [k, false]))

const TODAY = new Date().toISOString()

/* ------------------------------------------------------------------ */
/* Templates                                                          */
/* ------------------------------------------------------------------ */

/** 1. Top Content */
const topContentAttrs: Record<string, boolean> = {
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

/** 2. Regional Updates */
const regionalAttrs: Record<string, boolean> = {
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

/** 3. No Newsletters */
const noNewsAttrs = allFalse()

/* ------------------------------------------------------------------ */
/* Export                                                             */
/* ------------------------------------------------------------------ */

export const DEFAULT_TEMPLATES: Template[] = [
  {
    name: "top-content",
    description: "Top Content newsletter bundle",
    attributes: topContentAttrs,
    overwriteFalse: true,
    createdAt: TODAY,
    isDefault: true,
  },
  {
    name: "regional-updates",
    description: "Regional Updates newsletter bundle",
    attributes: regionalAttrs,
    overwriteFalse: true,
    createdAt: TODAY,
    isDefault: true,
  },
  {
    name: "no-newsletters",
    description: "All newsletters turned off",
    attributes: noNewsAttrs,
    overwriteFalse: true,
    createdAt: TODAY,
    isDefault: true,
  },
]
