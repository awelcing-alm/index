"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TemplateListItem {
  name: string
  description: string
  overwriteFalse: boolean
  createdAt: string
  updatedAt?: string
}

export function ManageTemplatesList({
  templates,
  onEdit,
  onDuplicate,
  onDelete,
  showDefaultsSection,
}: {
  templates: TemplateListItem[]
  onEdit: (name: string) => void
  onDuplicate: (name: string) => void
  onDelete: (name: string) => void
  showDefaultsSection?: React.ReactNode
}) {
  return (
    <div className="mt-6 space-y-4">
      {showDefaultsSection}

      {templates.length === 0 && (
        <Alert className="rounded-none border border-line bg-[hsl(var(--muted))]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-ink">
            No custom templates yet. Create one in the Create tab.
          </AlertDescription>
        </Alert>
      )}

      {templates.map((tpl) => (
        <Card key={tpl.name} className="rounded-none border border-line bg-paper">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-ink capitalize">{tpl.name}</h3>
                <Badge variant="outline" className="rounded-none border-line text-xs text-ink">Custom</Badge>
                {tpl.overwriteFalse && (
                  <Badge variant="outline" className="rounded-none border-line text-xs text-ink">Overwrites&nbsp;false</Badge>
                )}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {tpl.createdAt ? `Created: ${new Date(tpl.createdAt).toLocaleDateString()}` : "Created: —"}
                {tpl.updatedAt ? ` (Updated ${new Date(tpl.updatedAt).toLocaleDateString()})` : ""}
              </p>
              <p className="max-w-md truncate text-sm text-[hsl(var(--muted-foreground))]" title={tpl.description}>{tpl.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEdit(tpl.name)} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => onDuplicate(tpl.name)} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]" title="Duplicate template">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(tpl.name)} className="rounded-none text-[hsl(var(--destructive))] hover:bg-[hsl(var(--muted))]" title="Delete template">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
