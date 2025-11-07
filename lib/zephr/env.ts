import "server-only"

export const ZEPHR_BASE_URL = process.env.ZEPHR_BASE_URL || "https://alm.api.zephr.com"
export const ZEPHR_PUBLIC_BASE_URL = process.env.ZEPHR_PUBLIC_BASE_URL || "alm-lawcom-live.non-prod.cdn.zephr.com"
export const ZEPHR_ACCESS_KEY = process.env.ZEPHR_ACCESS_KEY!
export const ZEPHR_SECRET_KEY = process.env.ZEPHR_SECRET_KEY!
export const HAS_ADMIN_KEYS = !!(process.env.ZEPHR_ACCESS_KEY && process.env.ZEPHR_SECRET_KEY)

export const ACCOUNTS_TTL_MS = Number(process.env.ACCOUNTS_TTL_MS ?? "60000")
