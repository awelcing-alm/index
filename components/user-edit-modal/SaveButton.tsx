"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type SaveButtonProps = {
  saving: boolean
  disabled: boolean
  hasGroupChange: boolean
  hasTemplateChange: boolean
  hasAttributeChanges: boolean
  attributeChangeCount: number
  newGroupName?: string
  templateName?: string
  onClick: () => void
}

export function SaveButton({
  saving,
  disabled,
  hasGroupChange,
  hasTemplateChange,
  hasAttributeChanges,
  attributeChangeCount,
  newGroupName,
  templateName,
  onClick,
}: SaveButtonProps) {
  // Build the button label based on what's changing
  const getButtonLabel = () => {
    if (saving) return "Saving…"
    
    const changes: string[] = []
    if (hasGroupChange) changes.push("Group")
    if (hasTemplateChange) changes.push("Template")
    if (hasAttributeChanges) changes.push("Attributes")
    
    if (changes.length === 0) return "Save Changes"
    if (changes.length === 1) return `Save ${changes[0]}`
    if (changes.length === 2) return `Save ${changes[0]} & ${changes[1]}`
    return "Save All Changes"
  }

  // Build the detailed summary for the popover
  const getSummary = () => {
    const items: string[] = []
    
    if (hasGroupChange && newGroupName) {
      items.push(`• Change group to "${newGroupName}"`)
    }
    if (hasTemplateChange && templateName) {
      items.push(`• Apply "${templateName}" template`)
    }
    if (hasAttributeChanges) {
      items.push(`• Update ${attributeChangeCount} attribute${attributeChangeCount !== 1 ? 's' : ''}`)
    }
    
    return items
  }

  const summary = getSummary()
  const hasChanges = hasGroupChange || hasTemplateChange || hasAttributeChanges

  // If no changes to show details for, just render a simple button
  if (!hasChanges || summary.length === 0) {
    return (
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-none border-line bg-ink text-paper hover:bg-ink/90"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Saving…
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
            Save Changes
          </>
        )}
      </Button>
    )
  }

  // Render button with popover showing details
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          className="rounded-none border-line bg-ink text-paper hover:bg-ink/90"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              {getButtonLabel()}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              {getButtonLabel()}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 rounded-none border border-line bg-paper p-3 text-sm"
        align="end"
      >
        <div className="space-y-2">
          <div className="font-medium text-ink">Changes to save:</div>
          <div className="space-y-1 text-xs text-[hsl(var(--muted-foreground))]">
            {summary.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
          <div className="pt-2 border-t border-line">
            <Button
              type="button"
              onClick={onClick}
              disabled={disabled || saving}
              size="sm"
              className="w-full rounded-none bg-ink text-paper hover:bg-ink/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-3 w-3" />
                  Confirm & Save
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
