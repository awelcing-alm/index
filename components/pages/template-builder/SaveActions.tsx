"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, CheckCircle } from "lucide-react"

export function SaveActions({
  current,
  setCurrent,
  isEditing,
  isDirty,
  saved,
  onSave,
  onCancel,
}: {
  current: { name: string; description: string }
  setCurrent: (fn: (p: any) => any) => void
  isEditing: boolean
  isDirty: boolean
  saved: string
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <>
      <div className="space-y-3">
        <div>
          <Label className="text-[hsl(var(--muted-foreground))]">Name</Label>
          <Input
            value={current.name}
            onChange={(e) => setCurrent((p: any) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Premium Access"
            className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
          />
          {saved && (
            <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              {saved}
            </div>
          )}
          {isEditing && (
            <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              Editing: <span className="text-ink">{current.name}{isDirty ? "*" : ""}</span>
            </div>
          )}
        </div>
        <div>
          <Label className="text-[hsl(var(--muted-foreground))]">Description</Label>
          <Input
            value={current.description}
            onChange={(e) => setCurrent((p: any) => ({ ...p, description: e.target.value }))}
            className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onSave}
          className="rounded-none bg-ink text-paper hover:bg-ink/90"
          disabled={isEditing && !isDirty}
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? (isDirty ? "Update" : "Up to date") : "Save"}
        </Button>

        {isEditing && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  )
}
