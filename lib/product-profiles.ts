// lib/product-profiles.ts
// Canonical, user-PII-free profile shapes for product-specific Extended Profiles

/*
  NOTE: These types intentionally omit user identifiers like user_id and email.
  They represent only the product preference payload we store in Extended Profile.
*/

/* ======================== MyLaw ======================== */

export type MyLawTopic = {
  mylawId: string
  name: string
  alertToPreferenceId?: string
}

export type MyLawCategory = {
  id: string
  name: string
  alertToPreferenceId?: string
}

export type MyLawVirtualCategory = {
  id: string
  name: string
  type?: string
  myLawDisplay?: string
  alertToPreferenceId?: string
}

export type MyLawPreferences = {
  myLawPrefLastUpdated?: string
  hasViewedTour?: boolean
  empty?: boolean
  myLawTopics: MyLawTopic[]
  customSearches: any[]
  caseDigests: any[]
  Industries: MyLawCategory[]
  "Practice Areas": MyLawCategory[]
  "Law Firms": any[]
  Companies: any[]
  Regions: any[]
  onBoardingStatus?: string
  virtualCategories: MyLawVirtualCategory[]
}

export type MyLawProfile = {
  preferences: MyLawPreferences
}

/* ======================== Radar (placeholder typing) ======================== */

export type RadarEntity = { id: string; name: string; type: string }

export type RadarProfile = {
  lastUpdatedDate?: string
  onBoardingStatus?: string
  hasCompass?: boolean
  hasRadar?: boolean
  defaultPromotionList?: string
  productList?: string
  profileCompletionRatio?: number
  followedEntities: RadarEntity[]
}

/* ======================== Helpers ======================== */

const asBool = (v: any, d = false) => (typeof v === "boolean" ? v : d)
const asString = (v: any, d = "") => (v == null ? d : String(v))
const asArray = <T = any>(v: any): T[] => (Array.isArray(v) ? (v as T[]) : [])

export function sanitizeMyLawProfile(raw: any): MyLawProfile {
  const p = raw?.preferences ?? raw?.data?.preferences ?? {}
  const prefs: MyLawPreferences = {
    myLawPrefLastUpdated: asString(p.myLawPrefLastUpdated || p.lastUpdated || ""),
    hasViewedTour: asBool(p.hasViewedTour, false),
    empty: asBool(p.empty, false),
    myLawTopics: asArray(p.myLawTopics).map((t: any) => ({
      mylawId: asString(t.mylawId),
      name: asString(t.name),
      alertToPreferenceId: t.alertToPreferenceId ? String(t.alertToPreferenceId) : undefined,
    })),
    customSearches: asArray(p.customSearches),
    caseDigests: asArray(p.caseDigests),
    Industries: asArray(p.Industries).map((c: any) => ({
      id: asString(c.id),
      name: asString(c.name),
      alertToPreferenceId: c.alertToPreferenceId ? String(c.alertToPreferenceId) : undefined,
    })),
    "Practice Areas": asArray(p["Practice Areas"]).map((c: any) => ({
      id: asString(c.id),
      name: asString(c.name),
      alertToPreferenceId: c.alertToPreferenceId ? String(c.alertToPreferenceId) : undefined,
    })),
    "Law Firms": asArray(p["Law Firms"]),
    Companies: asArray(p.Companies),
    Regions: asArray(p.Regions),
    onBoardingStatus: asString(p.onBoardingStatus || p.onboardingStatus || ""),
    virtualCategories: asArray(p.virtualCategories).map((v: any) => ({
      id: asString(v.id),
      name: asString(v.name),
      type: v.type ? String(v.type) : undefined,
      myLawDisplay: v.myLawDisplay ? String(v.myLawDisplay) : undefined,
      alertToPreferenceId: v.alertToPreferenceId ? String(v.alertToPreferenceId) : undefined,
    })),
  }
  return { preferences: prefs }
}

export function sanitizeRadarProfile(raw: any): RadarProfile {
  const u = raw?.data?.userData ?? raw?.userData ?? raw ?? {}
  const entities = asArray<RadarEntity>(u.followedEntities).map((e: any) => ({
    id: asString(e.id),
    name: asString(e.name),
    type: asString(e.type),
  }))
  return {
    lastUpdatedDate: asString(u.lastUpdatedDate || u.updatedAt || u.ts || ""),
    onBoardingStatus: asString(u.onBoardingStatus || u.onboardingStatus || ""),
    hasCompass: asBool(u.hasCompass, undefined as any),
    hasRadar: asBool(u.hasRadar, undefined as any),
    defaultPromotionList: u.defaultPromotionList ? String(u.defaultPromotionList) : undefined,
    productList: u.productList ? String(u.productList) : undefined,
    profileCompletionRatio: typeof u.profileCompletionRatio === "number" ? u.profileCompletionRatio : undefined,
    followedEntities: entities,
  }
}

/* ======================== UI helpers ======================== */

export function describeMyLaw(profile: MyLawProfile) {
  const p = profile.preferences
  return {
    lastUpdated: p.myLawPrefLastUpdated || "",
    hasViewedTour: !!p.hasViewedTour,
    onBoardingStatus: p.onBoardingStatus || "",
    counts: {
      topics: p.myLawTopics.length,
      industries: p.Industries.length,
      practiceAreas: p["Practice Areas"].length,
      virtualCategories: p.virtualCategories.length,
    },
    topics: p.myLawTopics.map((t) => ({ id: t.mylawId, name: t.name })),
    industries: p.Industries.map((c) => ({ id: c.id, name: c.name })),
    practiceAreas: p["Practice Areas"].map((c) => ({ id: c.id, name: c.name })),
    virtualCategories: p.virtualCategories.map((v) => ({ id: v.id, name: v.myLawDisplay || v.name })),
  }
}

export function describeRadar(profile: RadarProfile) {
  const list = profile.followedEntities || []
  const byType = list.reduce<Record<string, RadarEntity[]>>((acc, e) => {
    const t = (e.type || "").toLowerCase()
    acc[t] = acc[t] || []
    acc[t].push(e)
    return acc
  }, {})
  const count = (t: string) => (byType[t] ? byType[t].length : 0)
  return {
    lastUpdated: profile.lastUpdatedDate || "",
    onBoardingStatus: profile.onBoardingStatus || "",
    hasCompass: !!profile.hasCompass,
    hasRadar: !!profile.hasRadar,
    counts: {
      topics: count("topic"),
      companies: count("company"),
      lawFirms: count("law firm"),
      virtualCategories: count("virtual category"),
    },
    topics: (byType["topic"] || []).map(({ id, name }) => ({ id, name })),
    companies: (byType["company"] || []).map(({ id, name }) => ({ id, name })),
    lawFirms: (byType["law firm"] || []).map(({ id, name }) => ({ id, name })),
    virtualCategories: (byType["virtual category"] || []).map(({ id, name }) => ({ id, name })),
  }
}

/* ======================== Examples (sanitized) ======================== */

// These constants are built by dropping user fields (user_id, email)
// from the example payloads and normalizing through sanitizeMyLawProfile.

export const EXAMPLE_MYLAW_PROFILE_1: MyLawProfile = sanitizeMyLawProfile({
  preferences: {
    myLawPrefLastUpdated: "2025-06-19T16:50:18.603Z",
    hasViewedTour: false,
    empty: false,
    myLawTopics: [
      { mylawId: "mlp-95", name: "Insurance", alertToPreferenceId: "920ca37c-8e38-46c4-9644-3e152f8c08ec" },
      { mylawId: "mlp-4", name: "Admiralty", alertToPreferenceId: "0b6a66ae-4c32-436f-b695-bbb1f1a5604c" },
      { mylawId: "mlp-28", name: "Civil Procedure", alertToPreferenceId: "d85dd9f3-a4b8-49eb-bfde-564f5c5855b7" },
      { mylawId: "mlp-31", name: "Commercial Litigation", alertToPreferenceId: "5fd2cc49-62ac-4ff0-8537-28a16eb6e10e" },
      { mylawId: "mlp-43", name: "Corporate Governance", alertToPreferenceId: "33ddd23a-c2d4-46d8-afe6-e04cf5a5fb73" },
      { mylawId: "mlp-27", name: "Civil Appeals", alertToPreferenceId: "0447762a-a006-4b6b-93c0-2e8fdbc8cc6b" },
      { mylawId: "mlp-39", name: "Contract Litigation", alertToPreferenceId: "1c21bcab-ae20-49aa-b0e4-6689f48d86b9" },
      { mylawId: "mlp-40", name: "Contracts", alertToPreferenceId: "930fa707-bbe1-4435-af0a-a7122f99f559" },
      { mylawId: "mlp-71", name: "Evidence", alertToPreferenceId: "102a4f84-bc34-4510-a4e1-dab3cca22af0" },
      { mylawId: "mlp-134", name: "Legal Ethics and Attorney Discipline", alertToPreferenceId: "7d164e0f-168d-4678-9bb7-a1abd5e30a7d" },
      { mylawId: "mlp-142", name: "Litigators", alertToPreferenceId: "de1bdb41-7262-4f7b-b032-3a8994ec4483" },
      { mylawId: "mlp-170", name: "Products Liability", alertToPreferenceId: "e94bfbfb-7b2f-4c94-9173-a1a9bea0b79d" },
      { mylawId: "mlp-21", name: "Business Torts", alertToPreferenceId: "53e81878-a76c-4cf9-8f55-b3ce270e132e" },
    ],
    customSearches: [],
    caseDigests: [],
    Industries: [
      { id: "section_414", name: "Insurance Law", alertToPreferenceId: "daabc588-2b58-4900-adbc-b5a797dc133e" },
      { id: "section_415", name: "Insurance Litigation", alertToPreferenceId: "a4179cc0-8967-45b4-8127-a948a4cf5496" },
    ],
    "Practice Areas": [
      { name: "Admiralty", id: "section_356", alertToPreferenceId: "e922fa75-a68f-4b60-95c0-c743e37adbd0" },
      { name: "Civil Procedure", id: "section_369", alertToPreferenceId: "85133eb0-5031-47b5-99dc-d111f08cad6d" },
      { name: "Commercial Litigation", id: "section_1237", alertToPreferenceId: "cb61781a-4acd-46b7-acef-789fc7cc102b" },
      { name: "Corporate Governance", id: "section_381", alertToPreferenceId: "1da31530-c6ed-41c2-863d-28b2c2a9af7b" },
      { name: "Civil Appeals", id: "section_368", alertToPreferenceId: "bc09428-..." },
      { name: "Contractual Disputes", id: "section_378", alertToPreferenceId: "81232749-e159-491b-8c47-34342215a03e" },
      { name: "Contracts", id: "section_377", alertToPreferenceId: "cd26f27e-d641-479d-a98b-d21c6fb1f760" },
      { name: "Evidence", id: "section_401", alertToPreferenceId: "4a4efc98-d159-4d86-bb13-f0bdb6697e64" },
      { name: "Legal Ethics and Attorney Discipline", id: "section_438", alertToPreferenceId: "399aa394-8d5a-405c-9df6-34e299c9455b" },
      { name: "Litigators", id: "section_446", alertToPreferenceId: "1db79325-783f-4c55-a022-fe14f670583d" },
      { name: "Products Liability", id: "section_465", alertToPreferenceId: "60cb5a92-8d55-4898-93f3-abac94a74641" },
      { name: "Business Torts", id: "section_365", alertToPreferenceId: "26932028-89cc-42da-af7b-7f2750f3e4ae" },
    ],
    "Law Firms": [],
    Companies: [],
    Regions: [],
    onBoardingStatus: "onboarded",
    virtualCategories: [
      { id: "vc_17", name: "Texas Lawyer", type: "region", myLawDisplay: "Texas", alertToPreferenceId: "a56cdb3f-a385-465a-a78e-84952b80d517" },
    ],
  },
})

export const EXAMPLE_MYLAW_PROFILE_2: MyLawProfile = sanitizeMyLawProfile({
  preferences: {
    myLawPrefLastUpdated: "2025-07-22T17:18:08.012Z",
    hasViewedTour: false,
    empty: false,
    myLawTopics: [
      { mylawId: "mlp-127", name: "Law Firms - Small", alertToPreferenceId: "f9ee2cfe-0efe-4cf5-9dd9-1487b346edc7" },
      { mylawId: "mlp-134", name: "Legal Ethics and Attorney Discipline", alertToPreferenceId: "9c2d172b-72d1-4ddd-bc23-c9e06c91d6e4" },
      { mylawId: "mlp-113", name: "Law Firm Associates", alertToPreferenceId: "5f27c220-efc8-4df2-9ffd-0277d9a36fc1" },
      { mylawId: "mlp-122", name: "Law Firm Partners", alertToPreferenceId: "62e91031-4a7c-4598-96fd-6ee3769bc22f" },
      { mylawId: "mlp-120", name: "Law Firm Mergers", alertToPreferenceId: "5f981fcc-f175-4874-9315-703d81b5c7f1" },
    ],
    customSearches: [],
    caseDigests: [],
    Industries: [],
    "Practice Areas": [],
    "Law Firms": [],
    Companies: [],
    Regions: [],
    onBoardingStatus: "onboarded",
    virtualCategories: [
      { id: "vc_18", name: "Pennsylvania", type: "Region", myLawDisplay: "Pennsylvania", alertToPreferenceId: "1a60c12c-a54f-4e68-bcad-af403ffc5f10" },
      { id: "vc_15", name: "New Jersey", type: "Region", myLawDisplay: "New Jersey", alertToPreferenceId: "7d5b0f65-a46a-4bbd-b692-c09a630b3426" },
    ],
  },
})

export const EXAMPLE_RADAR_PROFILE: RadarProfile = sanitizeRadarProfile({
  data: {
    userData: {
      lastUpdatedDate: "2025-07-29T15:06:31.000Z",
      defaultPromotionList: "ALMREG;...",
      productList: "NWPM;CRPNEWS;...",
      profileCompletionRatio: 1,
      onBoardingStatus: "onboarded",
      hasCompass: true,
      hasRadar: false,
      followedEntities: [
        { id: "mlp-5", name: "Advertising", type: "topic" },
        { id: "450003401", name: "Microsoft", type: "company" },
        { id: "LF00000258", name: "Cooley", type: "law firm" },
        { id: "vc_9", name: "California", type: "virtual category" },
      ],
    },
  },
})
