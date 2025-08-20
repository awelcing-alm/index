// components/pages/users-table/UsersDataTable.tsx
"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { flexRender, type Table as ReactTable } from "@tanstack/react-table"

const StrictRow = ({
  className,
  children,
  ...rest
}: {
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLTableRowElement>) => (
  <TableRow className={className} {...rest}>
    {React.Children.toArray(children).filter((c) => typeof c !== "string")}
  </TableRow>
)

export function UsersDataTable<TData extends { user_id: string }>({
  table,
  onDragStart,
}: {
  table: ReactTable<TData>
  onDragStart: (e: React.DragEvent, userId: string) => void
}) {
  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <StrictRow key={hg.id} className="border-line hover:bg-[hsl(var(--muted))]">
              {hg.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </StrictRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const u = row.original as { user_id: string }
            return (
              <StrictRow
                key={row.id}
                className="border-line hover:bg-[hsl(var(--muted))]"
                draggable
                onDragStart={(e) => onDragStart(e as any, u.user_id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </StrictRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-line p-3 text-sm text-ink">
        <span>
          Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
}
