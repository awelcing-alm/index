"use client"

import { useEffect, useState } from "react"
import { getActiveAccountId } from "@/lib/account-store"
import { ApplyTemplatesModal } from "@/components/templates/apply-templates-modal"
import { toast } from "@/hooks/use-toast"
import { CreateGroupForm } from "@/components/pages/groups/CreateGroupForm"
import { GroupsList } from "@/components/pages/groups/GroupsList"
import { useGroups } from "@/hooks/use-groups"

export default function GroupManagerPage() {
  const accountId = getActiveAccountId()
  const { groups, loading, error, needsAccount, fetchGroups, deleteOne } = useGroups(accountId)

  const [applyOpen, setApplyOpen] = useState(false)
  const [applyGroupId, setApplyGroupId] = useState<string | null>(null)
  const [savedStacks, setSavedStacks] = useState<Array<{ name: string; list: string[] }>>([])
  const [initialStack, setInitialStack] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    try { const raw = localStorage.getItem("template_stacks"); const arr = raw ? JSON.parse(raw) : []; if (Array.isArray(arr)) setSavedStacks(arr) } catch {}
  }, [])

  if (needsAccount) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <nav className="text-sm text-muted-foreground">Dashboard › Groups</nav>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Create groups and manage templates, product grants, and demographics.
          </p>
        </div>
        <div className="rounded-xl border p-6 bg-background">
          <p className="text-red-600 font-medium">An active account is required to manage groups.</p>
          <p className="text-muted-foreground mt-1">Use the account switcher in the header to select an account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground">Dashboard › Groups</nav>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
            <p className="text-muted-foreground">
              Create groups and manage templates, product grants, and demographics.
            </p>
          </div>
          <a
            href="/analytics/groups"
            className="hidden rounded-none border border-line px-3 py-1 text-sm text-ink hover:bg-[hsl(var(--muted))] md:inline-block"
          >
            Open Group Usage
          </a>
        </div>
      </div>

      {/* Create */}
      <CreateGroupForm accountId={accountId} onCreated={fetchGroups} />

      {/* List */}
      <GroupsList
        groups={groups.map((g) => ({ id: g.id, slug: g.slug, name: g.name, color: g.color, icon: g.icon }))}
        savedStacks={savedStacks}
        onApply={(groupId) => { if (groupId) { setApplyGroupId(groupId) }; setApplyOpen(true) }}
        onDelete={async (g) => {
          try {
            await deleteOne({ slug: g.slug })
          } catch (err: any) {
            toast({ title: "Delete failed", description: err?.message || "Failed to delete group", variant: "destructive" })
          }
        }}
      />

      {/* Apply Templates to Group modal */}
      <ApplyTemplatesModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        target={{ type: "group", ids: applyGroupId ? [applyGroupId] : [] }}
        initialStack={initialStack}
        onApplied={({ wrote }) => {
          toast({ title: "Group apply complete", description: `${wrote} field${wrote === 1 ? "" : "s"} written.` })
          setApplyOpen(false)
          setInitialStack(undefined)
        }}
      />
    </div>
  )
}
