"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PaginationControls({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  setPageIndex,
  previousPage,
  nextPage,
}: {
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  setPageIndex: (i: number) => void
  previousPage: () => void
  nextPage: () => void
}) {
  return (
    <div className="flex items-center justify-between border-t border-line p-3 text-sm text-ink">
      <span>Page {pageIndex + 1} / {pageCount || 1}</span>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" onClick={() => setPageIndex(0)} disabled={!canPreviousPage} className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4 -ml-2" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => previousPage()} disabled={!canPreviousPage} className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => nextPage()} disabled={!canNextPage} className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setPageIndex(pageCount - 1)} disabled={!canNextPage} className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -ml-2" />
        </Button>
      </div>
    </div>
  )
}
