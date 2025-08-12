// components/pages/team-manager-page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import type { Team } from "@/lib/teams"
import TeamConfigurator from "@/components/team-configurator"
import TeamList from "@/components/team-list"

export default function TeamManagerPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/teams?includeMembers=true", { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const data: Team[] = await res.json()
      setTeams(data)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load teams")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + title */}
      <div className="space-y-1">
        <nav className="text-sm text-muted-foreground">Dashboard › Teams</nav>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">Create teams and manage templates, product grants, and demographics.</p>
      </div>

      {/* Create */}
      <section className="rounded-xl border p-4 md:p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
        <TeamConfigurator onCreated={fetchTeams} />
      </section>

      {/* List */}
      <section className="rounded-xl border p-4 md:p-6 bg-background">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Existing Teams</h2>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {loading ? <p>Loading teams…</p> : <TeamList teams={teams} onTeamSaved={fetchTeams} />}
      </section>
    </div>
  )
}
