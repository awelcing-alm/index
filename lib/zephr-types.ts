// lib/zephr-types.ts

// ===== Accounts =====
export interface ZephrAccount {
  account_id: string
  name: string
  email_address: string
  number_of_seats: number
  tenant_id: string
  created_date?: string
  modified_date?: string
}

export interface ZephrAccountsResponse {
  results: ZephrAccount[]
  total: number
}

// ===== Users =====
export interface ZephrUser {
  user_id: string
  identifiers: {
    email_address: string
  }
  attributes: Record<string, any>
  email_verified: boolean
  created_date?: string
  modified_date?: string
  account_id?: string
  user_type?: string
}

export interface ZephrUsersResponse {
  results: ZephrUser[]
  total: number
}

export interface ZephrAccountUser {
  user_id: string
  account_id: string
  tenantId: string
  subTenantId: string
  user_email: string
  user_type: string
  attributes?: Record<string, any>
}

// ===== Grants / Products =====
export interface ZephrAccountGrant {
  grant_id: string        // API field name
  user_id: string
  account_id: string
  expiry_state: string
  entitlement_type: string
  entitlement_id: string
  start_time: string      // API field name
  end_time: string        // API field name
  product_id: string
  created_at: string      // API field name
}

export interface ZephrEntitlement {
  id: string
  label?: string
  description?: string
  auto_assign?: string
  type?: string
  entitlementTenant?: string
}

export interface ZephrProduct {
  tenantId: string
  subTenantId?: string
  id: string
  label: string
  description?: string
  entitlement?: {
    id: string
    type: string
    entitlementTenant: string
  }
  mapping?: Record<string, any>
  sharingLimit?: number
  // When built from a grant:
  grantId?: string
  startTime?: string
  endTime?: string
  expiry_state?: string
}

export interface ZephrProductsResponse {
  results: ZephrProduct[]
  total: number
}
