const ZEPHR_PUBLIC_BASE_URL = process.env.ZEPHR_PUBLIC_BASE_URL || "alm-lawcom-live.non-prod.cdn.zephr.com"

export async function publicApiCall(path: string, options: RequestInit = {}) {
  const url = `https://${ZEPHR_PUBLIC_BASE_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Public API Error Response:", errorText)
    throw new Error(`Public API call failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response
}
