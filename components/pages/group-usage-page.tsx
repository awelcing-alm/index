"use client"

import React, { useEffect, useMemo, useState } from "react"
import type { Group } from "@/lib/groups"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Users as UsersIcon, Activity } from "lucide-react"
import { UserEditButton } from "@/components/user-edit-button"

export default function GroupUsagePage({ users, groups }: { users: any[]; groups: (Group & { user_count?: number })[] }) {
  const [filter, setFilter] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [membershipByUser, setMembershipByUser] = useState<Record<string, { group_id: string | null }>>({})
  const [sessionsByUser, setSessionsByUser] = useState<Record<string, { lastSession?: string; count?: number }>>({})

  // Map groups
  const groupsById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g] as const)), [groups])

  // Fetch membership for all users
  useEffect(() => {
    if (!users?.length) return
    const CHUNK = 200
    let cancelled = false
    ;(async () => {
      const ids = users.map((u) => u.user_id)
      for (let i = 0; i < ids.length; i += CHUNK) {
        if (cancelled) return
        const batch = ids.slice(i, i + CHUNK)
        const qs = encodeURIComponent(batch.join(","))
        const res = await fetch(`/api/groups/membership?user_ids=${qs}`, { cache: "no-store" })
        if (!res.ok) continue
        const payload = await res.json().catch(() => null)
        const map = (payload && payload.memberships) || {}
        setMembershipByUser((prev) => ({ ...prev, ...map }))
      }
    })()
    return () => { cancelled = true }
  }, [users])

  // Fetch sessions for all users
  useEffect(() => {
    if (!users?.length) return
    const CHUNK = 200
    let cancelled = false
    ;(async () => {
      const ids = users.map((u) => u.user_id)
      for (let i = 0; i < ids.length; i += CHUNK) {
        if (cancelled) return
        const batch = ids.slice(i, i + CHUNK)
        const qs = encodeURIComponent(batch.join(","))
        const res = await fetch(`/api/users/sessions?user_ids=${qs}`, { cache: "no-store" })
        if (!res.ok) continue
        const payload = await res.json().catch(() => null)
        const map = (payload && payload.sessions) || {}
        setSessionsByUser((prev) => ({ ...prev, ...map }))
      }
    })()
    return () => { cancelled = true }
  }, [users])

  // Build group -> users
  const usersByGroup = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const u of users) {
      const g = membershipByUser[u.user_id]?.group_id
      if (!g) continue
      if (!map[g]) map[g] = []
      map[g].push(u)
    }
    return map
  }, [users, membershipByUser])

  const groupsDisplay = useMemo(() => {
    const items = groups.map((g) => {
      const us = usersByGroup[g.id] || []
      const total = us.length
      let active30 = 0
      let totalSessions = 0
      let latestTs = 0
      for (const u of us) {
        const s = sessionsByUser[u.user_id]
        if (s?.count) totalSessions += s.count
        if (s?.lastSession) {
          const t = Date.parse(s.lastSession)
          if (!isNaN(t)) {
            if (Date.now() - t <= 30 * 24 * 60 * 60 * 1000) active30 += 1
            if (t > latestTs) latestTs = t
          }
        }
      }
      const avgSessions = total ? (totalSessions / total) : 0
      return { group: g, total, active30, totalSessions, avgSessions, latestTs }
    })
    const q = filter.trim().toLowerCase()
    return items
      .filter((x) => !q || x.group.name.toLowerCase().includes(q))
      .sort((a, b) => b.total - a.total)
  }, [groups, usersByGroup, sessionsByUser, filter])

  const totalUsers = users.length
  const totalActive30 = useMemo(() => groupsDisplay.reduce((acc, x) => acc + x.active30, 0), [groupsDisplay])

  const fmtDate = (t: number) => t ? new Date(t).toLocaleDateString() : "—"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-ink" aria-hidden="true" />
          <h1 className="font-serif text-2xl text-ink">Group Usage</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter groups…" className="h-8 w-64 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-none border border-line bg-paper"><CardHeader className="pb-2"><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Total Users</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-ink">{totalUsers}</CardContent></Card>
        <Card className="rounded-none border border-line bg-paper"><CardHeader className="pb-2"><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Active (30d)</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-ink">{totalActive30}</CardContent></Card>
        <Card className="rounded-none border border-line bg-paper"><CardHeader className="pb-2"><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Groups</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-ink">{groups.length}</CardContent></Card>
      </div>

      {/* Table */}
      <Card className="rounded-none border border-line bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-ink"><Activity className="h-4 w-4" aria-hidden="true" /> Usage by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-line">
                <TableHead className="text-ink">Group</TableHead>
                <TableHead className="text-ink">Users</TableHead>
                <TableHead className="text-ink">Active 30d</TableHead>
                <TableHead className="text-ink">Latest Activity</TableHead>
                <TableHead className="text-ink">Total Sessions</TableHead>
                <TableHead className="text-ink">Avg Sessions</TableHead>
                <TableHead className="text-ink"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupsDisplay.map((row) => (
                <React.Fragment key={row.group.id}>
                  <TableRow className="border-line">
                    <TableCell className="text-ink">{row.group.name}</TableCell>
                    <TableCell className="text-ink">{row.total}</TableCell>
                    <TableCell className="text-ink">{row.active30}</TableCell>
                    <TableCell className="text-ink">{fmtDate(row.latestTs)}</TableCell>
                    <TableCell className="text-ink">{row.totalSessions}</TableCell>
                    <TableCell className="text-ink">{row.avgSessions.toFixed(1)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="rounded-none text-ink hover:bg-[hsl(var(--muted))]" onClick={() => setExpanded((p) => ({ ...p, [row.group.id]: !p[row.group.id] }))}>
                        {expanded[row.group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />} Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded[row.group.id] && (
                    <TableRow className="border-line bg-[hsl(var(--muted))]/20">
                      <TableCell colSpan={7}>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {(usersByGroup[row.group.id] || []).map((u) => {
                            const sess = sessionsByUser[u.user_id]
                            const last = sess?.lastSession ? new Date(sess.lastSession).toLocaleDateString() : "—"
                            const count = typeof sess?.count === "number" ? sess.count : "—"
                            return (
                              <div key={u.user_id} className="flex items-center justify-between rounded-none border border-line bg-paper p-2">
                                <div>
                                  <div className="font-medium text-ink">{u.identifiers?.email_address}</div>
                                  <div className="text-xs text-[hsl(var(--muted-foreground))]">Last: {last} • Sessions: {count}</div>
                                </div>
                                <UserEditButton userId={u.user_id} userEmail={u.identifiers?.email_address} existingAttributes={u.attributes} groups={groups as any} />
                              </div>
                            )
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
