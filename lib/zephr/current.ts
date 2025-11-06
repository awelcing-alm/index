"use server"

import "server-only"
import { getCurrentUser } from "./auth"
import { getUsersByAccount } from "./users"
import { getProductsByAccount } from "./products"
import type { ZephrUser, ZephrProductWithGrant } from "./types"

export async function getUsersForCurrentAccount(): Promise<ZephrUser[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) return []
  try {
    return await getUsersByAccount(user.activeAccount.account_id)
  } catch (e) {
    console.error("Error fetching users for account:", e)
    return []
  }
}

export async function getProductsForCurrentAccount(): Promise<ZephrProductWithGrant[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) return []
  try {
    return await getProductsByAccount(user.activeAccount.account_id)
  } catch (e) {
    console.error("Error fetching products for account:", e)
    return []
  }
}
