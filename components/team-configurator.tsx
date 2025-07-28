"use client";

import { useCallback, useEffect, useState } from "react";
import type { Team } from "@/lib/teams";
import TeamList from "@/components/team-list";

interface TeamPayload {
  id?: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  default_template?: string | null;
  product_grant_ids?: string[] | null;
}

interface Props {
  initial?: TeamPayload;
  onCreated?: (team: TeamPayload) => void;
}

export default function TeamConfigurator({ initial, onCreated }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [template, setTemplate] = useState(initial?.default_template ?? "");
  const [grants, setGrants] = useState(
    (initial?.product_grant_ids ?? [])?.join(",") ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }
    setSaving(true);
    setError(null);
    const payload: TeamPayload = {
      id: initial?.id,
      name: name.trim(),
      color: color || null,
      icon: icon || null,
      default_template: template || null,
      product_grant_ids: grants
        ? grants
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
    };
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      onCreated?.(payload);
      // reset form if creating a new team
      if (!initial?.id) {
        setName("");
        setColor("");
        setIcon("");
        setTemplate("");
        setGrants("");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Color (hex)</label>
        <input
          type="text"
          value={color ?? ""}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Icon</label>
        <input
          type="text"
          value={icon ?? ""}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Default Template
        </label>
        <input
          type="text"
          value={template ?? ""}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Product Grant IDs (comma-separated UUIDs)
        </label>
        <input
          type="text"
          value={grants}
          onChange={(e) => setGrants(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {saving ? "Saving…" : initial?.id ? "Update Team" : "Create Team"}
      </button>
    </div>
  );
}
