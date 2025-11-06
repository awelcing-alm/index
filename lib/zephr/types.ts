import "server-only"

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

export interface ZephrAccountUser {
  user_id: string
  account_id: string
  tenantId: string
  subTenantId: string
  user_email: string
  user_type: string
  attributes?: Record<string, any>
}

export interface ZephrUser {
  user_id: string
  identifiers: { email_address: string }
  attributes?: Record<string, any>
  email_verified?: boolean
  created_date?: string
  modified_date?: string
  account_id?: string
  user_type?: string
}

export interface ZephrUsersResponse {
  results: ZephrUser[]
  total: number
}

export interface ZephrProduct {
  tenantId: string
  subTenantId?: string
  id: string
  label: string
  description?: string
  entitlement?: { id: string; type: string; entitlementTenant: string }
  mapping?: Record<string, any>
  sharingLimit?: number
}

export interface ZephrAccountGrant {
  grantId: string
  account_id: string
  user_id: string
  expiry_state: string
  entitlement_type: string
  entitlement_id: string
  startTime: string
  endTime: string
  product_id: string
  createdAt: string
}

export interface ZephrProductWithGrant extends ZephrProduct {
  grantId: string
  startTime: string
  endTime: string
  expiry_state: string
}

export interface LoginResult {
  success: boolean
  error?: string
  isAdmin?: boolean
  userEmail?: string
  accounts?: ZephrAccount[]
}
