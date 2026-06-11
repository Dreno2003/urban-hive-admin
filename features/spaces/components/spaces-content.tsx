"use client"

import { useState } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Pagination } from "@/shared/components/ui/pagination"
import { cn } from "@/shared/lib/utils"
import { useSpacesSummary, useSpacesList } from "../hooks/use-spaces"
import type { SpaceTypeBar } from "../types"
import { Badge } from "@/shared/components/ui/badge"

const COLS = ["ID", "Name", "Space type", "Rate", "Availability", "Available", "Action"]
const WIDTHS = ["w-[8%]", "w-[20%]", "w-[14%]", "w-[14%]", "w-[14%]", "w-[16%]", "w-[14%]"]

function SpaceBar({ bar }: { bar: SpaceTypeBar }) {
  const filledBars = bar.total - bar.free
  return (
    <div className="flex-1 border rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-gray-700">{bar.label}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: bar.total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 w-1 rounded-sm",
                i < filledBars ? "bg-[#F5C518]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
      <span className="text-[25px] font-bold ">
        {bar.total}<span className="text-[12px] font-normal text-secondary-foreground">/10 · {bar.free} free</span>
      </span>
    </div>
  )
}

export function SpacesContent() {
  const [page, setPage] = useState(1)

  const { data: summary, isLoading: summaryLoading } = useSpacesSummary()
  const { data: list, isLoading: listLoading } = useSpacesList(page)

  const spaces = list?.spaces ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="flex-1 bg-white flex flex-col min-h-screen">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Spaces</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all workspace types and availability</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary-outline" className="rounded-full h-[42px] px-5 text-sm font-medium gap-2">
              <Icon name="exportSquareOutline" size={15} />
              Export CSV
            </Button>
            <Button className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2">
              <Icon name="plus" size={15} />
              Add space
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <InsetCard title="Total spaces" className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.totalSpaces ?? 0} trend={summary?.totalSpacesLabel} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard title="Total booked" className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.totalBooked ?? 0} trend={summary?.totalBookedLabel} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard title="Total available" className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.totalAvailable ?? 0} trend={summary?.totalAvailableLabel} trendType="neutral" />
            )}
          </InsetCard>
        </div>

        {/* Space type bars */}
        {!summaryLoading && summary && summary.spaceBars.length > 0 && (
          <div className="flex items-stretch gap-2 mb-6">
          {/* <div className="flex items-stretch gap-4 mb-6"> */}
            {summary.spaceBars.map((bar) => (
              <SpaceBar key={bar.label} bar={bar} />
            ))}
          </div>
        )}

        {/* Spaces Table */}
        <div className="bg-white border rounded-[28px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight">All spaces</h4>
            <Button variant="secondary-outline" className="rounded-full h-9 px-4 text-sm gap-1.5">
              <Icon name="sort" size={14} />
              Filter
              <Icon name="chevronDown" size={13} />
            </Button>
          </div>

          {/* Column headers */}
          <div className="flex items-center bg-secondary px-6 py-3.5 border-y">
            {COLS.map((col, i) => (
              <span key={col} className={cn("text-[12.5px] font-semibold tracking-wide", WIDTHS[i])}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y">
            {listLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-5 gap-2 animate-pulse">
                  {WIDTHS.map((w, j) => <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />)}
                </div>
              ))
            ) : spaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Icon name="grid" className="size-[72px] text-secondary-foreground" />
                <p className="text-[16px] font-semibold text-gray-900">No spaces</p>
                <p className="text-sm text-secondary-foreground">No space has been added yet</p>
              </div>
            ) : (
              spaces.map((space) => (
                <div key={space.id} className="flex *:text-secondary-foreground items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                  <span className={cn("text-[13px] ", WIDTHS[0])}>{space.id}</span>
                  <span className={cn("text-[13px] font-medium ", WIDTHS[1])}>{space.name}</span>
                  <span className={cn("text-[13px] ", WIDTHS[2])}>{space.spaceType}</span>
                  <span className={cn("text-[13px] ", WIDTHS[3])}>{space.rate}</span>
                  <span className={cn("text-[13px]", WIDTHS[4], )}>
                  {/* <span className={cn("text-[13px]", WIDTHS[4], space.availability === "Available" ? "text-green-600" : "text-orange-500")}> */}
                    <Badge
                      variant={'default-outline'}
                      // variant={space.availability === "Available" ? "default" : "destructive"}
                      className=""
                    >
                      {space.availability}
                    </Badge>
                  </span>
                  <span className={cn("text-[13px] ", WIDTHS[5])}>{space.availableDate}</span>
                  <span className={cn("text-[13px] font-medium text-primary cursor-pointer hover:underline", WIDTHS[6])}>Edit</span>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!listLoading && (
            <div className="px-6 py-4 border-t">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
