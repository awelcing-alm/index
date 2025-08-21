"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export type AccountRef = { account_id: string | number; name?: string }

type Props = {
  activeAccount?: AccountRef
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function ExportUsersButton({ activeAccount, onClick, disabled, className }: Props) {
  const label = activeAccount?.name ? `Export Users – ${activeAccount.name}` : "Export Users"

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
      <span className="sr-only">Open export users modal</span>
    </Button>
  )
}
