"use client"

import type { Group } from "@/lib/groups"

export type GroupWithCount = Group & { user_count?: number }

export type UiUser = {
  user_id: string
  identifiers: { email_address: string }
  attributes: Record<string, any>
  user_type?: string | null
  group_id?: string | null
  group_icon?: string | null
  group_name?: string | null
}
