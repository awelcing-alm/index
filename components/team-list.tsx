// components/team-list.tsx
"use client"

import type { Team } from "@/lib/teams"
import { useState } from "react"
import TeamConfigurator from "./team-configurator"
import { Button } from "@/components/ui/button"


interface TeamListProps {
  teams: Team[]
  onTeamSaved: () => void
}

export default function TeamList({ teams, onTeamSaved }: TeamListProps) {
  const [editing, setEditing] = useState<Team | null>(null)

return (
  <div className="space-y-4">
    {editing ? (
      <div className="panel p-4">
        <h3 className="mb-2 font-serif text-lg text-ink">
          Edit Team — {editing.name}
        </h3>

        <TeamConfigurator
          initial={{
            id: editing.id,
            name: editing.name,
            color: editing.color ?? null,                // keep nulls
            icon: editing.icon ?? null,
            default_template: editing.default_template ?? null,
            product_grant_ids: editing.product_grant_ids ?? [],
            demographics: editing.demographics ?? {},
          }}
          onCreated={() => {
            setEditing(null);
            onTeamSaved();
          }}
        />

        <Button
          type="button"
          variant="link"
          className="mt-2 rounded-none text-ink underline underline-offset-2 hover:bg-[hsl(var(--muted))]"
          onClick={() => setEditing(null)}
        >
          Cancel
        </Button>
      </div>
    ) : (
      <ul className="divide-y divide-line">
        {teams.map((team) => (
          <li key={team.id} className="flex flex-col gap-1 py-4">
            <div className="flex items-center gap-2">
              {team.color ? (
                <span
                  className="inline-block h-3 w-3 border border-line"
                  style={{ backgroundColor: team.color }}
                  aria-label={`Team color ${team.color}`}
                />
              ) : null}

              {team.icon ? (
                <span className="text-sm font-medium text-ink" aria-label="Team icon">
                  {team.icon}
                </span>
              ) : null}

              <span className="text-md font-medium text-ink">{team.name}</span>
            </div>

            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Default template: {team.default_template ?? "–"}
            </div>

            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Members: {typeof team.member_count === "number" ? team.member_count : 0}
            </div>

            <Button
              type="button"
              variant="link"
              className="mt-1 w-max rounded-none text-ink underline underline-offset-2 hover:bg-[hsl(var(--muted))]"
              onClick={() => setEditing(team)}
            >
              Edit
            </Button>
          </li>
        ))}

        {teams.length === 0 && (
          <li className="py-4 text-sm text-[hsl(var(--muted-foreground))]">No teams found.</li>
        )}
      </ul>
    )}
  </div>
);
}