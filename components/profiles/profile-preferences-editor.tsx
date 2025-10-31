"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"

type AlertSpec = {
  enabled?: boolean
  schedule?: "daily" | "weekly"
  time?: string // 24h HH:mm
  tz?: string
  weekday?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
}

type PrefItem = { id?: string; name: string; alert?: AlertSpec }

type GenericProfile = {
  preferences: {
    topics: PrefItem[]
    regions: PrefItem[]
  }
}

function emptyGeneric(): GenericProfile { return { preferences: { topics: [], regions: [] } } }

function parseGeneric(text: string): GenericProfile {
  try {
    const raw = text ? JSON.parse(text) : {}
    const p = raw?.preferences || {}
    return {
      preferences: {
        topics: Array.isArray(p.topics) ? p.topics.map((t: any) => ({ name: String(t?.name || ""), id: t?.id ? String(t.id) : undefined, alert: t?.alert })) : [],
        regions: Array.isArray(p.regions) ? p.regions.map((r: any) => ({ name: String(r?.name || ""), id: r?.id ? String(r.id) : undefined, alert: r?.alert })) : [],
      },
    }
  } catch {
    return emptyGeneric()
  }
}

function stringifyGeneric(g: GenericProfile): string {
  return JSON.stringify({ preferences: g.preferences }, null, 2)
}

export function ProfilePreferencesEditor({
  jsonText,
  onJsonChange,
}: {
  jsonText: string
  onJsonChange: (next: string) => void
}) {
  const initial = useMemo(() => parseGeneric(jsonText), [jsonText])
  const [model, setModel] = useState<GenericProfile>(initial)
  const [topicInput, setTopicInput] = useState("")
  const [regionInput, setRegionInput] = useState("")

  useEffect(() => { setModel(parseGeneric(jsonText)) }, [jsonText])
  useEffect(() => { onJsonChange(stringifyGeneric(model)) }, [model]) // eslint-disable-line react-hooks/exhaustive-deps

  const addTopic = () => {
    const name = topicInput.trim()
    if (!name) return
    setModel((m) => ({ ...m, preferences: { ...m.preferences, topics: [...m.preferences.topics, { name }] } }))
    setTopicInput("")
  }
  const addRegion = () => {
    const name = regionInput.trim()
    if (!name) return
    setModel((m) => ({ ...m, preferences: { ...m.preferences, regions: [...m.preferences.regions, { name }] } }))
    setRegionInput("")
  }

  const removeItem = (kind: "topics" | "regions", idx: number) => {
    setModel((m) => {
      const arr = [...m.preferences[kind]]
      arr.splice(idx, 1)
      return { ...m, preferences: { ...m.preferences, [kind]: arr } }
    })
  }

  const toggleAlert = (kind: "topics" | "regions", idx: number, on: boolean) => {
    setModel((m) => {
      const arr = [...m.preferences[kind]]
      const it = { ...arr[idx] }
      it.alert = on ? { ...(it.alert || {}), enabled: true, schedule: it.alert?.schedule || "daily", time: it.alert?.time || "13:00", tz: it.alert?.tz || "America/New_York", weekday: it.alert?.weekday || "Mon" } : { enabled: false }
      arr[idx] = it
      return { ...m, preferences: { ...m.preferences, [kind]: arr } }
    })
  }

  const setAlertField = (kind: "topics" | "regions", idx: number, key: keyof AlertSpec, value: any) => {
    setModel((m) => {
      const arr = [...m.preferences[kind]]
      const it = { ...arr[idx] }
      it.alert = { ...(it.alert || {}), [key]: value, enabled: true }
      arr[idx] = it
      return { ...m, preferences: { ...m.preferences, [kind]: arr } }
    })
  }

  const renderList = (kind: "topics" | "regions", arr: PrefItem[], placeholder: string, onAdd: () => void, inputVal: string, setInput: (v: string) => void) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input value={inputVal} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className="h-8 w-80 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]" />
        <Button size="sm" onClick={onAdd} className="rounded-none bg-ink text-paper hover:bg-ink/90">Add</Button>
      </div>
      {arr.length === 0 ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">No items yet.</p>
      ) : (
        <div className="space-y-2">
          {arr.map((it, idx) => (
            <div key={`${it.id || it.name}-${idx}`} className="rounded-none border border-line bg-paper p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-none border-line text-ink">{it.name}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox className="rounded-none" checked={!!it.alert?.enabled} onCheckedChange={(v) => toggleAlert(kind, idx, v === true)} />
                    <Label className="text-[hsl(var(--muted-foreground))]">Alert</Label>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeItem(kind, idx)} className="rounded-none text-[hsl(var(--destructive))] hover:bg-[hsl(var(--muted))]">Remove</Button>
                </div>
              </div>
              {it.alert?.enabled && (
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[110px_120px_1fr]">
                  <div>
                    <Label className="text-[hsl(var(--muted-foreground))]">Schedule</Label>
                    <Select value={it.alert.schedule || "daily"} onValueChange={(v) => setAlertField(kind, idx, "schedule", v as any)}>
                      <SelectTrigger className="h-8 rounded-none border border-line bg-paper text-ink"><SelectValue placeholder="Schedule" /></SelectTrigger>
                      <SelectContent className="rounded-none border border-line bg-paper">
                        <SelectItem value="daily" className="rounded-none">Daily</SelectItem>
                        <SelectItem value="weekly" className="rounded-none">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[hsl(var(--muted-foreground))]">Time</Label>
                    <Input type="time" value={it.alert.time || "13:00"} onChange={(e) => setAlertField(kind, idx, "time", e.target.value)} className="h-8 rounded-none border border-line bg-paper text-ink" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-[120px_1fr]">
                    {it.alert.schedule === "weekly" && (
                      <div>
                        <Label className="text-[hsl(var(--muted-foreground))]">Weekday</Label>
                        <Select value={it.alert.weekday || "Mon"} onValueChange={(v) => setAlertField(kind, idx, "weekday", v as any)}>
                          <SelectTrigger className="h-8 rounded-none border border-line bg-paper text-ink"><SelectValue placeholder="Day" /></SelectTrigger>
                          <SelectContent className="rounded-none border border-line bg-paper">
                            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                              <SelectItem key={d} value={d} className="rounded-none">{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label className="text-[hsl(var(--muted-foreground))]">Time Zone</Label>
                      <Input value={it.alert.tz || "America/New_York"} onChange={(e) => setAlertField(kind, idx, "tz", e.target.value)} className="h-8 rounded-none border border-line bg-paper text-ink" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-ink">Content Preferences</h4>
        {renderList("topics", model.preferences.topics, "Add a topic (e.g., Aerospace)", addTopic, topicInput, setTopicInput)}
      </div>
      <div>
        <h4 className="mb-2 font-medium text-ink">Regional Preferences</h4>
        {renderList("regions", model.preferences.regions, "Add a region (e.g., Texas)", addRegion, regionInput, setRegionInput)}
      </div>
    </div>
  )
}
