"use client";

/*
 * TeamList – a presentational component for displaying the list of
 * teams belonging to an account. Each team shows its name, colour,
 * icon, default template and current members. A simple Edit button
 * allows callers to trigger editing of a team using the supplied
 * callback. When editing, callers should render a TeamConfigurator
 * with the returned team as the initial state. This component does
 * not implement deletion to keep the example concise.
 */

import type { Team } from "@/lib/teams";
import { useState } from "react";
import TeamConfigurator from "./team-configurator";

interface TeamListProps {
  teams: Team[];
  /**
   * Called whenever a team is created or updated. The parent can
   * re-fetch teams at this point to reflect the latest state.
   */
  onTeamSaved: () => void;
}

export default function TeamList({ teams, onTeamSaved }: TeamListProps) {
  const [editing, setEditing] = useState<Team | null>(null);

  return (
    <div className="space-y-4">
      {/* When editing is non-null we render a TeamConfigurator in place. */}
      {editing ? (
        <div className="p-4 border border-gray-300 rounded bg-white">
          <h3 className="text-lg font-medium mb-2">
            Edit Team — {editing.name}
          </h3>
          <TeamConfigurator
            initial={{
              id: editing.id,
              name: editing.name,
              color: editing.color ?? undefined,
              icon: editing.icon ?? undefined,
              default_template: editing.default_template ?? undefined,
              product_grant_ids: editing.product_grant_ids ?? undefined,
            }}
            onCreated={() => {
              setEditing(null);
              onTeamSaved();
            }}
          />
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
        </div>
      ) : (
        /* Otherwise render the list of teams */
        <ul className="divide-y divide-gray-200">
          {teams.map((team) => (
            <li key={team.id} className="py-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {/* Colour swatch */}
                {team.color ? (
                  <span
                    className="inline-block w-3 h-3 rounded-sm border border-gray-400"
                    style={{ backgroundColor: team.color }}
                  />
                ) : null}
                {/* Icon – for simplicity we just show the icon name */}
                {team.icon ? (
                  <span className="text-sm font-semibold text-gray-700">
                    {team.icon}
                  </span>
                ) : null}
                <span className="text-md font-medium">{team.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                Default template: {team.default_template ?? "–"}
              </div>
              <div className="text-sm text-gray-600">
                Members: {team.users && team.users.length > 0
                  ? team.users
                      .map((u: any) => u.name ?? u.email ?? u.id)
                      .join(", ")
                  : "None"}
              </div>
              <button
                type="button"
                className="mt-1 text-sm text-blue-600 underline w-max"
                onClick={() => setEditing(team)}
              >
                Edit
              </button>
            </li>
          ))}
          {teams.length === 0 && (
            <li className="py-4 text-sm text-gray-600">No teams found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
