"use client"

import { useState } from "react"
import { ExportUsersButton } from "@/components/export-users-button"
import { ExportUsersModal } from "@/components/export-users-modal"

type AccountRef = { account_id: string | number; name?: string }

export default function UsersExportControls({ activeAccount }: { activeAccount?: AccountRef }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ExportUsersButton activeAccount={activeAccount} onClick={() => setOpen(true)} />
      <ExportUsersModal open={open} onOpenChange={setOpen} activeAccount={activeAccount} />
    </>
  )
}
