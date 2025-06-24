# Zephr Admin Application

This application provides a comprehensive interface for managing Zephr accounts, users, and products using the Zephr Admin API.

## Environment Variables

The following environment variables are required:

- `ZEPHR_BASE_URL` - The base URL for the Zephr Admin API (e.g., `https://alm.api.zephr.com`)
- `ZEPHR_PUBLIC_BASE_URL` - The public base URL for Zephr (e.g., `alm-lawcom-live.non-prod.cdn.zephr.com`)
- `ZEPHR_ACCESS_KEY` - Your Zephr API access key
- `ZEPHR_SECRET_KEY` - Your Zephr API secret key

## API Usage Guide

### Account Products Lookup

To show which products are added to an account, the application uses a 3-step process:

#### Step 1: Get Account Grants
\`\`\`
GET /v3/accounts/{accountId}/grants
\`\`\`

This endpoint returns all grants associated with an account. Each grant contains:
- `grantId` - Unique identifier for the grant
- `entitlement_type` - Type of entitlement (bundle, entitlement, meter, credits)
- `entitlement_id` - ID of the specific entitlement
- `product_id` - ID of the product associated with this grant
- `startTime` / `endTime` - Grant validity period
- `expiry_state` - Current state (active, pending, expired)

#### Step 2: Get Product Details (Optional)
\`\`\`
GET /v3/products/{productId}
\`\`\`

For each `product_id` found in the grants, fetch detailed product information:
- `label` - Human-readable product name
- `description` - Product description
- `entitlement` - Associated entitlement details
- `sharingLimit` - Number of users who can share this product

#### Step 3: Get Entitlement Details (Optional)
\`\`\`
GET /v3/entitlements/{entitlementId}
\`\`\`

For additional context, fetch entitlement details:
- `label` - Entitlement name
- `description` - Entitlement description
- `auto_assign` - Assignment behavior

#### Implementation Example

The `getProductsByAccount()` function in `lib/zephr-api.ts` demonstrates this pattern:

\`\`\`typescript
export async function getProductsByAccount(accountId: string): Promise<ZephrProductWithGrant[]> {
  // Step 1: Get account grants
  const accountGrantsResponse = await adminApiCall(`/v3/accounts/${accountId}/grants`)
  const accountGrants = accountGrantsResponse.results || accountGrantsResponse
  
  const productsWithGrants: ZephrProductWithGrant[] = []
  
  for (const grant of accountGrants) {
    // Create base product from grant data
    const productWithGrant = {
      id: grant.product_id || grant.entitlement_id,
      label: grant.entitlement_id?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      grantId: grant.grantId,
      startTime: grant.startTime,
      endTime: grant.endTime,
      expiry_state: grant.expiry_state
    }
    
    // Step 2: Enhance with product details (if available)
    if (grant.product_id) {
      try {
        const productDetails = await adminApiCall(`/v3/products/${grant.product_id}`)
        if (productDetails?.label) {
          productWithGrant.label = productDetails.label
          productWithGrant.description = productDetails.description
        }
      } catch (error) {
        // Continue with grant-based info if product fetch fails
      }
    }
    
    productsWithGrants.push(productWithGrant)
  }
  
  return productsWithGrants
}
\`\`\`

### User Attributes Lookup and Editing

To show which user attributes a user already has and enable editing, use these endpoints:

#### Get User Details
\`\`\`
GET /v3/users/{userId}
\`\`\`

This returns the complete user object including:
- `user_id` - Unique user identifier
- `identifiers` - User identifiers (email, username)
- `attributes` - All user attributes with current values
- `email_verified` - Email verification status

#### Get Account Users (Alternative)
\`\`\`
GET /v3/accounts/{accountId}/users
\`\`\`

This returns all users in an account with their attributes. Each user object includes:
- `user_id` - User identifier
- `user_email` - User's email address
- `attributes` - User attributes object

#### Update User Attributes
\`\`\`
PATCH /v3/users/{userId}/attributes
\`\`\`

Updates specific user attributes while leaving others unchanged. Send a JSON object with the attributes to update:

\`\`\`json
{
  "firstname": "George",
  "lastname": "Smith",
  "organization": "ACME Corp",
  "job-area": "In-House Counsel"
}
\`\`\`

#### Supported User Attributes

Based on the Zephr user schema, the following attributes are supported:

**Core Profile Attributes:**
- `firstname` - First name
- `lastname` - Last name  
- `organization` - Organization name
- `address` - Street address
- `city` - City
- `country` - Country (US, UK, etc.)
- `state` - State/Province (AK, AL, CA, CO, NJ, NY, etc.)
- `phone` - Phone number
- `zip-code` - Postal/ZIP code

**Professional Attributes:**
- `job-area` - Job area (In-House Counsel, Technology Executive, Law Firm, etc.)
- `job-function` - Job function (General Counsel, Associate, CEO, Student, etc.)
- `area-of-practice` - Practice area (Admiralty/Aviation/Transportation, Aerospace and Defense, etc.)

#### Implementation Example

The user edit functionality demonstrates the complete flow:

1. **Fetch existing attributes** using `GET /v3/users/{userId}` or from account users list
2. **Display current values** in the edit form, showing "George" in the firstname field
3. **Allow editing** - user changes "George" to "Borge"
4. **Update via PATCH** - send only the changed attributes:

\`\`\`typescript
const updateUserAttributes = async (userId: string, attributes: Record<string, any>) => {
  const response = await adminApiCall(`/v3/users/${userId}/attributes`, {
    method: "PATCH",
    body: JSON.stringify(attributes)
  })
  
  // Returns 200 OK or 204 No Content on success
  return response
}

// Example usage - changing firstname from "George" to "Borge"
await updateUserAttributes("user-123", {
  firstname: "Borge"
})
\`\`\`

### Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully  
- `204 No Content` - Successful update with no response body
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)

### Authentication

All API requests must be signed using HMAC-SHA256. The application handles this automatically using the configured access and secret keys. The signing process follows this pattern:

1. Create a hash using: `secretKey + body + path + query + method + timestamp + nonce`
2. Generate signature as hex-encoded SHA256 hash
3. Include in Authorization header: `ZEPHR-HMAC-SHA256 accessKey:timestamp:nonce:signature`

### Rate Limiting and Pagination

- Most list endpoints support pagination via `page` and `rpp` (results per page) parameters
- Default page size is typically 10-50 items
- Use the `total` field in responses to determine total available items
- For large datasets, implement pagination to avoid timeouts

### Best Practices

1. **Cache product and entitlement details** to reduce API calls
2. **Handle missing data gracefully** - not all grants may have complete product information
3. **Validate attribute values** before sending updates
4. **Use batch operations** when updating multiple users
5. **Implement retry logic** for transient failures
6. **Log API interactions** for debugging and monitoring

## Application Features

- **Account Management** - View and manage Zephr accounts
- **User Management** - List, view, and edit user profiles and attributes
- **Product Subscriptions** - View account-specific product grants and subscriptions
- **Authentication** - Secure login with session management
- **Responsive Design** - Works on desktop and mobile devices

## Development

The application is built with:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components
- Server Actions for API interactions

To run locally:
1. Set up environment variables
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000
