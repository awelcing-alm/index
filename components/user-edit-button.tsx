"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { ZephrUser } from "@/lib/zephr-types"

// Props your modal expects (from your working example)
type UserEditModalProps = {
  userDetails: ZephrUser | null
  loading: boolean
  error: string | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated?: () => void
}

// Tell next/dynamic what props the loaded component accepts
const UserEditModal = dynamic<UserEditModalProps>(
  () =>
    import("@/components/user-edit-modal").then((m: any) => {
      // support both named and default export
      return (m.UserEditModal ?? m.default) as React.ComponentType<UserEditModalProps>
    }),
  { ssr: false }
)

type Props = {
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any>
}

export function UserEditButton({ userId, userEmail, existingAttributes }: Props) {
  const [open, setOpen] = useState(false)

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
          isOpen={open}
          onClose={() => setOpen(false)}
          userDetails={{
            user_id: userId,
            identifiers: { email_address: userEmail },
            attributes: existingAttributes ?? {},
          } as ZephrUser}
          loading={false}
          error={null}
        />
      )}
    </>
  )
}
