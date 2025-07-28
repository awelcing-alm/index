"use client";

import { useCallback, useEffect, useState } from "react";
import type { Team } from "@/lib/teams";
import TeamConfigurator from "@/components/team-configurator";
import TeamList from "@/components/team-list";

export default function TeamManagerPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // helper to fetch teams with includeMembers=true
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/teams?includeMembers=true");
      if (!res.ok) throw new Error(await res.text());
      const data: Team[] = await res.json();
      setTeams(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Team Management</h2>
      {error && <p className="text-red-600">{error}</p>}
      {/* New team form */}
      <div>
        <h3 className="text-lg font-medium mb-2">Create New Team</h3>
        <TeamConfigurator onCreated={fetchTeams} />
      </div>
      {/* Existing teams */}
      {loading ? (
        <p>Loading teams…</p>
      ) : (
        <TeamList teams={teams} onTeamSaved={fetchTeams} />
      )}
    </div>
  );
}
