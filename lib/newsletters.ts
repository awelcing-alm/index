// lib/newsletters.ts – full flattened list of newsletter attribute slugs
// Generated from sample JSONs. Maintain alphabetical order for readability.

export const NEWSLETTER_KEYS = [
  "accounting-financial-planning-for-law-firms",
  "asia-pacific-news-alert",
  "asia-pacific-newsroom-update",
  "bench-report-your-guide-to-the-latest-judicial-news",
  "business-crimes-bulletin",
  "business-of-law-law-firm-disrupted",
  "capital-markets-updates",
  "class-actions-critical-mass",
  "clp-weekly-roundup",
  "commercial-leasing-law-strategy",
  "corporate-counsel-afternoon-update",
  "corporate-counsel-morning-update",
  "corporate-counsel-newsroom-update",
  "corporate-counsel-women-influence-and-power-in-law",
  "cybersecurity-law-strategy",
  "cybersecurity-technology-media-telecom-update",
  "daily-report-court-opinions",
  "daily-scan",
  "entertainment-law-strategy",
  "foreign-direct-investment-update",
  "global-leaders-in-law-members-newsletter",
  "in-house-inside-track",
  "in-the-news",
  "ip-skilled-in-the-art",
  "lawcom-afternoon-update",
  "lawcom-barometer",
  "lawcom-california-newsroom-update",
  "lawcom-connecticut-newsroom-update",
  "lawcom-delaware-business-court-insider-alert",
  "lawcom-delaware-newsroom-update",
  "lawcom-florida-newsroom-update",
  "lawcom-georgia-newsroom-update",
  "lawcom-international-morning-update",
  "lawcom-international-newsroom-update",
  "lawcom-leverage",
  "lawcom-morning-minute",
  "lawcom-new-jersey-daily-decision-alert",
  "lawcom-new-jersey-newsroom-update",
  "lawcom-new-york-newsroom-update",
  "lawcom-newsroom-update",
  "lawcom-pennsylvania-newsroom-update",
  "lawcom-pennsylvania-public-notices",
  "lawcom-pro-mid-market-daily-update",
  "lawcom-pro-mid-market-newsroom-update",
  "lawcom-pro-strategic-insights",
  "lawcom-texas-newsroom-update",
  "lawcom-weekend",
  "lean-adviser-legal-weekly-briefing",
  "legal-education-ahead-of-the-curve",
  "legaltech-news-afternoon-update",
  "legaltech-news-morning-update",
  "legaltech-news-newsroom-update",
  "le-labor-of-law",
  "marketing-the-law-firm",
  "new-jersey-law-journal-weekly-case-update",
  "new-york-law-journal-case-update",
  "new-york-real-estate-law-bulletin",
  "regulatory-update",
  "supreme-court-brief",
  "the-american-lawyer-afternoon-update",
  "the-american-lawyer-litigation-daily",
  "the-american-lawyer-morning-update",
  "the-american-lawyer-newsroom-update",
  "the-asia-legal-briefing",
  "the-bankruptcy-strategist",
  "the-global-lawyer",
  "the-intellectual-property-strategist",
  "the-legal-intelligencer-weekly-case-alert",
  "the-london-lawyer",
  "the-national-law-journal-afternoon-update",
  "the-national-law-journal-morning-update",
  "the-national-law-journal-newsroom-update",
  "the-recorder-case-alert",
  "trend-detection-update",
  "trend-detection-weekly-scan",
  "uk-daily-alert",
  "uk-newsroom-update",
  "verdictsearch-california",
  "verdictsearch-carolina",
  "verdictsearch-dc-metro",
  "verdictsearch-employment-law",
  "verdictsearch-florida",
  "verdictsearch-georgia",
  "verdictsearch-medical-malpractice",
  "verdictsearch-michigan",
  "verdictsearch-national",
  "verdictsearch-new-england",
  "verdictsearch-new-jersey",
  "verdictsearch-new-york",
  "verdictsearch-ohio",
  "verdictsearch-pennsylvania",
  "verdictsearch-product-liability",
  "verdictsearch-texas",
  "znewstest",
] as const

export type NewsletterSlug = typeof NEWSLETTER_KEYS[number]

/* -----------------------------------------------------------------------------
   Grouped order (default sort + UI sections)
   ---------------------------------------------------------------------------*/

export type NewsletterGroup = {
  name: string
  slugs: NewsletterSlug[]
}

// Helper to assert slugs exist in NEWSLETTER_KEYS
function s<T extends NewsletterSlug>(...x: T[]) { return x }

export const NEWSLETTER_GROUPS: NewsletterGroup[] = [
  {
    name: "News",
    slugs: s(
      "lawcom-morning-minute",
      "lawcom-afternoon-update",
      "lawcom-newsroom-update",
      "lawcom-weekend",
    ),
  },
  {
    name: "Regional Newsroom Updates",
    slugs: s(
      "lawcom-california-newsroom-update",
      "lawcom-connecticut-newsroom-update",
      "lawcom-delaware-newsroom-update",
      "lawcom-delaware-business-court-insider-alert",
      "lawcom-florida-newsroom-update",
      "lawcom-georgia-newsroom-update",
      "lawcom-new-jersey-newsroom-update",
      "lawcom-new-jersey-daily-decision-alert",
      "lawcom-new-york-newsroom-update",
      "lawcom-pennsylvania-newsroom-update",
      "lawcom-texas-newsroom-update",
    ),
  },
  {
    name: "Briefings",
    slugs: s(
      "lawcom-barometer",
      "supreme-court-brief",
      "legal-education-ahead-of-the-curve",
      "bench-report-your-guide-to-the-latest-judicial-news",
      "class-actions-critical-mass",
      "in-house-inside-track",
      "le-labor-of-law",
      "business-of-law-law-firm-disrupted",
      "ip-skilled-in-the-art",
    ),
  },
  {
    name: "Legal News",
    slugs: s("in-the-news"),
  },
  {
    name: "Case Digests",
    slugs: s(
      "daily-report-court-opinions",
      "new-jersey-law-journal-weekly-case-update",
      "new-york-law-journal-case-update",
      "the-legal-intelligencer-weekly-case-alert",
      "the-recorder-case-alert",
    ),
  },
  {
    name: "International",
    slugs: s(
      "lawcom-international-morning-update",
      "lawcom-international-newsroom-update",
      "the-global-lawyer",
      "the-asia-legal-briefing",
      "asia-pacific-news-alert",
      "asia-pacific-newsroom-update",
      "the-london-lawyer",
      "uk-daily-alert",
      "uk-newsroom-update",
    ),
  },
  {
    name: "The American Lawyer",
    slugs: s(
      "the-american-lawyer-morning-update",
      "the-american-lawyer-afternoon-update",
      "the-american-lawyer-newsroom-update",
      "the-american-lawyer-litigation-daily",
    ),
  },
  {
    name: "National Law Journal",
    slugs: s(
      "the-national-law-journal-morning-update",
      "the-national-law-journal-afternoon-update",
      "the-national-law-journal-newsroom-update",
    ),
  },
  {
    name: "Legaltech News",
    slugs: s(
      "legaltech-news-morning-update",
      "legaltech-news-afternoon-update",
      "legaltech-news-newsroom-update",
    ),
  },
  {
    name: "Corporate Counsel",
    slugs: s(
      "corporate-counsel-morning-update",
      "corporate-counsel-afternoon-update",
      "corporate-counsel-newsroom-update",
      "corporate-counsel-women-influence-and-power-in-law",
    ),
  },
  {
    name: "Law.com Pro",
    slugs: s(
      "lawcom-pro-strategic-insights",
      "lawcom-pro-mid-market-daily-update",
      "lawcom-pro-mid-market-newsroom-update",
    ),
  },
  {
    name: "Law.com Radar",
    slugs: s("daily-scan", "trend-detection-weekly-scan", "trend-detection-update"),
  },
  {
    name: "Public Notices",
    slugs: s("lawcom-pennsylvania-public-notices"),
  },
  {
    name: "Memberships & Practice Tools",
    slugs: s("global-leaders-in-law-members-newsletter"),
  },
  {
    name: "China Law & Practice",
    slugs: s(
      "clp-weekly-roundup",
      "capital-markets-updates",
      "cybersecurity-technology-media-telecom-update",
      "foreign-direct-investment-update",
      "regulatory-update",
    ),
  },
  {
    name: "Law Journal News",
    slugs: s(
      "accounting-financial-planning-for-law-firms",
      "commercial-leasing-law-strategy",
      "cybersecurity-law-strategy",
      "entertainment-law-strategy",
      "marketing-the-law-firm",
      "the-bankruptcy-strategist",
      "the-intellectual-property-strategist",
      "new-york-real-estate-law-bulletin",
      "business-crimes-bulletin",
    ),
  },
  {
    name: "Lean Adviser",
    slugs: s("lean-adviser-legal-weekly-briefing"),
  },
  {
    name: "VerdictSearch",
    slugs: s(
      "verdictsearch-national",
      "verdictsearch-california",
      "verdictsearch-carolina",
      "verdictsearch-dc-metro",
      "verdictsearch-florida",
      "verdictsearch-georgia",
      "verdictsearch-michigan",
      "verdictsearch-new-england",
      "verdictsearch-new-jersey",
      "verdictsearch-new-york",
      "verdictsearch-ohio",
      "verdictsearch-pennsylvania",
      "verdictsearch-texas",
      "verdictsearch-employment-law",
      "verdictsearch-medical-malpractice",
      "verdictsearch-product-liability",
    ),
  },
  {
    name: "Product Updates",
    slugs: s("lawcom-leverage"),
  },
]

// Any slugs not explicitly grouped go to "Other"
const groupedSet = new Set<NewsletterSlug>(NEWSLETTER_GROUPS.flatMap(g => g.slugs))
export const NEWSLETTER_OTHER_SLUGS = (NEWSLETTER_KEYS.filter(k => !groupedSet.has(k)) as NewsletterSlug[])
export const ALL_NEWSLETTER_GROUPS: NewsletterGroup[] = [
  ...NEWSLETTER_GROUPS,
  ...(NEWSLETTER_OTHER_SLUGS.length ? [{ name: "Other", slugs: NEWSLETTER_OTHER_SLUGS }] : []),
]

// A stable numeric order for default sorting
export const NEWSLETTER_ORDER: Record<NewsletterSlug, number> = (() => {
  const order: Partial<Record<NewsletterSlug, number>> = {}
  let i = 0
  for (const g of ALL_NEWSLETTER_GROUPS) {
    for (const slug of g.slugs) order[slug] = ++i
  }
  return order as Record<NewsletterSlug, number>
})()

export const sortNewsletterSlugs = (slugs: NewsletterSlug[]) =>
  slugs
    .slice()
    .sort(
      (a, b) =>
        (NEWSLETTER_ORDER[a] ?? Number.MAX_SAFE_INTEGER) -
          (NEWSLETTER_ORDER[b] ?? Number.MAX_SAFE_INTEGER) ||
        a.localeCompare(b)
    )
