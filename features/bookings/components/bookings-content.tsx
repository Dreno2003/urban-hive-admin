"use client"

import React, { useState } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { BookingsBarChart } from "./bookings-bar-chart"
import { useBookingsSummary, useBookingsList } from "../hooks/use-bookings"
import { CalendarDays, ChevronDown } from "lucide-react"

export function BookingsContent() {
  const [page, setPage] = useState(1)
  const { data: summary, isLoading: summaryLoading } = useBookingsSummary()
  const { data: list, isLoading: listLoading } = useBookingsList(page)

  const bookings = list?.bookings ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-8 md:px-12 pt-8 pb-12 mt-[76px]">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All confirmed, pending, and past bookings</p>
          </div>
          <Button className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2">
            <Icon name="download" size={15} />
            Export CSV
          </Button>
        </div>

        {/* ── Summary Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {/* Active bookings */}
          <InsetCard title="Active bookings">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-12 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.activeBookings ?? 0}
                trend={summary?.activeBookings === 0 ? "No bookings yet" : undefined}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* Check-ins today */}
          <InsetCard title="Check-ins today">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-12 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.checkInsToday ?? 0}
                trend={summary?.checkInsToday === 0 ? "No bookings yet" : undefined}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* Bookings this year */}
          <InsetCard
            title={`${summary?.bookingsThisYear ?? 0} bookings this year`}
            headerExtra={
              <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {summary?.currentYear ?? new Date().getFullYear()}
                <ChevronDown className="size-4" />
              </button>
            }
          >
            {summaryLoading ? (
              <Skeleton className="h-[80px] w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ) : (
              <BookingsBarChart data={summary?.monthlyData ?? []} />
            )}
          </InsetCard>
        </div>

        {/* ── Active Bookings Table ────────────────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
              Active bookings
            </h4>
            <div className="flex items-center gap-2">
              {/* Shortlist filter pill */}
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
                <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Shortlet</span>
                <span className="flex items-center justify-center bg-gray-700 dark:bg-gray-600 text-white text-[10px] font-bold rounded-full size-[18px]">
                  2
                </span>
                <button className="text-gray-400 hover:text-gray-600 ml-0.5">
                  <Icon name="x" size={12} />
                </button>
              </div>
              {/* Filters button */}
              <Button
                variant="secondary-outline"
                size="sm"
                className="rounded-full h-[34px] px-4 gap-2 text-[13px]"
              >
                <Icon name="sliders" size={14} />
                Filters (2)
                <ChevronDown className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Empty state / table body */}
          {listLoading ? (
            <div className="px-6 pb-6 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-[72px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <CalendarDays className="size-9 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-[16px] font-semibold text-gray-900 dark:text-white">No bookings</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">No bookings has been made yet</p>
            </div>
          ) : (
            <div className="px-6 pb-6">
              {/* Table rows would render here */}
            </div>
          )}

          {/* Pagination */}
          {!listLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 font-medium disabled:opacity-40"
              >
                <Icon name="chevronLeft" size={16} /> Previous
              </button>
              <span>{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 font-medium disabled:opacity-40"
              >
                Next <Icon name="chevronRight" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
