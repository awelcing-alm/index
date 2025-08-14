"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { UserEditModal } from "@/components/user-edit-modal"
import type { Group } from "@/lib/groups"

type AfterSavePayload = {
  userId: string
  oldGroupId?: string | null
  newGroupId?: string | null
  newAttributes?: Record<string, any>
  appliedTemplateName?: string | null
}

export function UserEditButton({
  userId,
  userEmail,
  existingAttributes,
  groups,
  onAfterSave,
}: {
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any>
  groups: (Group & { user_count?: number })[]
  onAfterSave?: (p: AfterSavePayload) => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<any | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true); setError(null)
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error(`Failed to fetch user ${userId}`)
        const data = await res.json()
        setDetails(data)
      } catch (e: any) {
        console.error(e)
        // fall back to minimal object so modal can still open
        setDetails({
          user_id: userId,
          identifiers: { email_address: userEmail },
          attributes: existingAttributes || {},
        })
        setError(e?.message ?? "Failed to load user details")
      } finally {
        setLoading(false)
      }
    })()
  }, [open, userId, userEmail, existingAttributes])

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
        onClick={() => setOpen(true)}
      >
        <Pencil className="mr-1 h-4 w-4" />
        Edit
      </Button>

      {open && (
        <UserEditModal
          isOpen={open}
          onClose={() => setOpen(false)}
          loading={loading}
          error={error}
          userDetails={details}
          groups={groups}
          onAfterSave={(p) => {
            onAfterSave?.(p)
          }}
        />
      )}
    </>
  )
}
