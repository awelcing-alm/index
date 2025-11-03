// lib/product-schemas.ts
// Canonical product template schemas for Extended Profiles

export type FieldBase = {
  key: string
  label: string
  type: string
  required?: boolean
}

export type FieldEnum = FieldBase & { type: "enum"; options: string[] }
export type FieldPicklist = FieldBase & { type: "picklist"; options: string[] }
export type FieldString = FieldBase & { type: "string"; pattern?: string }
export type FieldBoolean = FieldBase & { type: "boolean" }
export type FieldDate = FieldBase & { type: "date" }
export type FieldDateTime = FieldBase & { type: "datetime" }
export type FieldObject = FieldBase & { type: "object"; fields: ProductField[] }
export type FieldArray = FieldBase & { type: "array"; items: FieldObject | FieldString | FieldPicklist | FieldEnum | FieldBoolean | FieldDate | FieldDateTime }
export type ProductField = FieldEnum | FieldPicklist | FieldString | FieldBoolean | FieldDate | FieldDateTime | FieldObject | FieldArray

export type ProductSchema = {
  product: "MyLaw" | "Radar" | "Compass" | "Scholar"
  schema: { fields: ProductField[] }
}

export const SCHEMA_MYLAW: ProductSchema = {
  product: "MyLaw",
  schema: {
    fields: [
      {
        key: "preferences",
        label: "Preferences",
        type: "object",
        fields: [
          { key: "emailFrequency", label: "Email Frequency", type: "enum", options: ["Daily","Weekly","Monthly","Never"] },
          { key: "digestFormat", label: "Digest Format", type: "enum", options: ["Summary","Detailed","Headlines"] },
          { key: "notificationsEnabled", label: "Notifications Enabled", type: "boolean" },
        ],
      },
      { key: "topics", label: "Topics", type: "picklist", options: [
        "mlp-11","mlp-118","mlp-125","mlp-117","mlp-123","mlp-45","mlp-200","mlp-122","mlp-119","mlp-120","mlp-139","mlp-113","mlp-84","mlp-40","mlp-24","mlp-121","mlp-136","mlp-134","mlp-132","mlp-97","mlp-126","mlp-23","mlp-66","mlp-30","mlp-10","mlp-162","mlp-178","mlp-207","mlp-107","mlp-184","mlp-133","mlp-27","mlp-161","mlp-58","mlp-75","mlp-55","mlp-127","mlp-95","mlp-170","mlp-16","mlp-149","mlp-165","mlp-46","mlp-209","mlp-147","mlp-69","mlp-208","mlp-74","mlp-175","mlp-150","mlp-15","mlp-115","mlp-12","mlp-31","mlp-131","mlp-50","mlp-192","mlp-52","mlp-116","mlp-39","mlp-112","mlp-128","mlp-68","mlp-130","mlp-28","mlp-183","mlp-203","mlp-137","mlp-93","mlp-88","mlp-167","mlp-67","mlp-186","mlp-191","mlp-124","mlp-34","mlp-109","mlp-204","mlp-212","mlp-142","mlp-199","mlp-201","mlp-87","mlp-108","mlp-49","mlp-43","mlp-32","mlp-29","mlp-205","mlp-185","mlp-164","mlp-38","mlp-86","mlp-60","mlp-71","mlp-111","mlp-135","mlp-8","mlp-148","mlp-51"
      ]},
      { key: "regions", label: "Regions", type: "picklist", options: ["New York","North America","UK","California","Washington","Europe","New Jersey","Pennsylvania","Florida","Texas","Asia Pacific","Georgia","Middle East and Africa","Delaware","Latin America","Connecticut"] },
      {
        key: "alerts",
        label: "Alerts",
        type: "array",
        items: {
          type: "object",
          key: "alert",
          label: "Alert",
          fields: [
            { key: "alertName", label: "Alert Name", type: "string" },
            { key: "alertTopics", label: "Alert Topics", type: "picklist", options: [
              "mlp-11","mlp-118","mlp-125","mlp-117","mlp-123","mlp-45","mlp-200","mlp-122","mlp-119","mlp-120","mlp-139","mlp-113","mlp-84","mlp-40","mlp-24","mlp-121","mlp-136","mlp-134","mlp-132","mlp-97","mlp-126","mlp-23","mlp-66","mlp-30","mlp-10","mlp-162","mlp-178","mlp-207","mlp-107","mlp-184","mlp-133","mlp-27","mlp-161","mlp-58","mlp-75","mlp-55","mlp-127","mlp-95","mlp-170","mlp-16","mlp-149","mlp-165","mlp-46","mlp-209","mlp-147","mlp-69","mlp-208","mlp-74","mlp-175","mlp-150","mlp-15","mlp-115","mlp-12","mlp-31","mlp-131","mlp-50","mlp-192","mlp-52","mlp-116","mlp-39","mlp-112","mlp-128","mlp-68","mlp-130","mlp-28","mlp-183","mlp-203","mlp-137","mlp-93","mlp-88","mlp-167","mlp-67","mlp-186","mlp-191","mlp-124","mlp-34","mlp-109","mlp-204","mlp-212","mlp-142","mlp-199","mlp-201","mlp-87","mlp-108","mlp-49","mlp-43","mlp-32","mlp-29","mlp-205","mlp-185","mlp-164","mlp-38","mlp-86","mlp-60","mlp-71","mlp-111","mlp-135","mlp-8","mlp-148","mlp-51" ] },
            { key: "alertRegions", label: "Alert Regions", type: "picklist", options: ["New York","North America","UK","California","Washington","Europe","New Jersey","Pennsylvania","Florida","Texas","Asia Pacific","Georgia","Middle East and Africa","Delaware","Latin America","Connecticut"] },
            { key: "frequency", label: "Frequency", type: "enum", options: ["Real-time","Daily","Weekly"] },
            { key: "enabled", label: "Enabled", type: "boolean" },
          ],
        },
      },
    ],
  },
}

export const SCHEMA_RADAR: ProductSchema = {
  product: "Radar",
  schema: {
    fields: [
      { key: "preferences", label: "Preferences", type: "object", fields: [
        { key: "emailFrequency", label: "Email Frequency", type: "enum", options: ["Real-time","Daily","Weekly","Monthly","Never"] },
        { key: "digestFormat", label: "Digest Format", type: "enum", options: ["Summary","Detailed","Headlines","Full Text"] },
        { key: "notificationsEnabled", label: "Notifications Enabled", type: "boolean" },
        { key: "autoArchive", label: "Auto Archive", type: "boolean" },
      ]},
      // reuse options from MyLaw constants (explicit to avoid TS cast noise)
      { key: "topics", label: "Topics", type: "picklist", options: (SCHEMA_MYLAW.schema.fields[1] as any).options },
      { key: "regions", label: "Regions", type: "picklist", options: (SCHEMA_MYLAW.schema.fields[2] as any).options },
      { key: "courts", label: "Courts", type: "picklist", options: [
        "US Supreme Court","Federal Circuit Courts","District Courts - Southern District of New York","District Courts - Northern District of California","District Courts - District of Delaware","State Supreme Courts - New York","State Supreme Courts - California","State Supreme Courts - Texas","Bankruptcy Courts","Tax Courts","International Trade Courts","Court of Appeals - DC Circuit","Court of Appeals - 2nd Circuit","Court of Appeals - 9th Circuit"
      ]},
      { key: "alerts", label: "Alerts", type: "array", items: {
        type: "object", key: "alert", label: "Alert", fields: [
          { key: "alertName", label: "Alert Name", type: "string" },
          { key: "alertTopics", label: "Alert Topics", type: "picklist", options: (SCHEMA_MYLAW.schema.fields[1] as any).options },
          { key: "alertRegions", label: "Alert Regions", type: "picklist", options: (SCHEMA_MYLAW.schema.fields[2] as any).options },
          { key: "alertCourts", label: "Alert Courts", type: "picklist", options: [
            "US Supreme Court","Federal Circuit Courts","District Courts - Southern District of New York","District Courts - Northern District of California","District Courts - District of Delaware","State Supreme Courts - New York","State Supreme Courts - California","State Supreme Courts - Texas","Bankruptcy Courts","Tax Courts","International Trade Courts","Court of Appeals - DC Circuit","Court of Appeals - 2nd Circuit","Court of Appeals - 9th Circuit"
          ]},
          { key: "frequency", label: "Frequency", type: "enum", options: ["Real-time","Hourly","Daily","Weekly"] },
          { key: "enabled", label: "Enabled", type: "boolean" },
        ]
      }}
    ],
  },
}

export const SCHEMA_COMPASS: ProductSchema = {
  product: "Compass",
  schema: { fields: [
    { key: "firmName", label: "Firm Name", type: "string", required: true },
    { key: "downloadLimit", label: "Download Limit", type: "enum", options: ["10","25","50","100","250","500","1000","2500","5000","10000"], required: true },
  ]},
}

export const SCHEMA_SCHOLAR: ProductSchema = {
  product: "Scholar",
  schema: { fields: [
    { key: "isbns", label: "ISBNs", type: "array", items: { type: "object", key: "isbnItem", label: "ISBN Item", fields: [
      { key: "isbn", label: "ISBN", type: "string", pattern: "^(978|979)[0-9]{10}$" },
      { key: "title", label: "Title", type: "string" },
      { key: "author", label: "Author", type: "string" },
      { key: "addedDate", label: "Added Date", type: "date" },
    ] } },
  ]},
}

export const PRODUCT_SCHEMAS = {
  mylaw: SCHEMA_MYLAW,
  radar: SCHEMA_RADAR,
  compass: SCHEMA_COMPASS,
  scholar: SCHEMA_SCHOLAR,
} as const
