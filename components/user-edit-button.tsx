"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserEditModal } from "./user-edit-modal"
import { getUserDetailsAction } from "@/lib/user-actions"
import type { ZephrUser } from "@/lib/zephr-types"

interface UserEditButtonProps {
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any>
  onUserUpdated?: () => void
}

export function UserEditButton({ userId, userEmail, existingAttributes, onUserUpdated }: UserEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<ZephrUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenModal = async () => {
    console.log(`[UserEditButton] Opening modal for user: ${userId}`)
    console.log(`[UserEditButton] User email: ${userEmail}`)
    console.log(`[UserEditButton] Existing attributes from list:`, JSON.stringify(existingAttributes, null, 2))

    setLoading(true)
    setError(null)
    setIsModalOpen(true)

    try {
      // Try to fetch fresh user details via server action
      console.log(`[UserEditButton] Attempting to fetch fresh user details via server action for: ${userId}`)
      const result = await getUserDetailsAction(userId)
      console.log(`[UserEditButton] Server action result:`, JSON.stringify(result, null, 2))

      if (result.success && result.data) {
        console.log(`[UserEditButton] Successfully fetched user details:`, JSON.stringify(result.data, null, 2))
        setUserDetails(result.data)
      } else {
        console.error(`[UserEditButton] Server action failed:`, result.error)
        if (result.details) {
          console.error(`[UserEditButton] Error details:`, result.details)
        }
        throw new Error(result.error || "Failed to fetch user details")
      }
    } catch (fetchError) {
      console.error(`[UserEditButton] Error fetching user details:`, fetchError)

      // Fall back to using existing attributes from the user list
      console.log(`[UserEditButton] Falling back to existing attributes from user list`)
      const fallbackUser: ZephrUser = {
        user_id: userId,
        identifiers: { email_address: userEmail },
        attributes: existingAttributes || {},
        email_verified: true,
      }

      console.log(`[UserEditButton] Using fallback user data:`, JSON.stringify(fallbackUser, null, 2))
      setUserDetails(fallbackUser)
      setError(
        `Could not fetch latest user details: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}. Using cached data from user list.`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setUserDetails(null)
    setError(null)
  }

  const handleUserUpdated = () => {
    onUserUpdated?.()
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

return (
  <>
    <Button
      variant="ghost"
      size="sm"
      className="rounded-none text-ink hover:bg-[hsl(var(--muted))] hover:text-ink"
      onClick={handleOpenModal}
      aria-label="Edit user"
    >
      Edit
    </Button>

    <UserEditModal
      userDetails={userDetails}
      loading={loading}
      error={error}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onUserUpdated={handleUserUpdated}
    />
  </>
);
}

