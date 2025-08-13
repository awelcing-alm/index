"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { ZephrUser } from "@/lib/zephr-types"
import type { Group } from "@/lib/groups"
import { UserEditModal } from "@/components/user-edit-modal"

type Props = {
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any>
  groups: Group[]
  onUserUpdated?: () => void
}

export function UserEditButton({
  userId,
  userEmail,
  existingAttributes,
  groups,
  onUserUpdated,
}: Props) {
  const [open, setOpen] = useState(false)

  // minimal shell; modal will fetch fresh details
  const user: ZephrUser = {
    user_id: userId,
    identifiers: { email_address: userEmail },
    attributes: existingAttributes ?? {},
  } as any

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
      >
        <Pencil className="mr-1 h-4 w-4" />
        Edit
      </Button>

      {open && (
        <UserEditModal
          userDetails={user}
          loading={false}
          error={null}
          isOpen={open}
          onClose={() => setOpen(false)}
          onUserUpdated={onUserUpdated}
          groups={groups}
        />
      )}
    </>
  )
}
