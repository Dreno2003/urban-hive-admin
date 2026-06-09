"use client"

import React, { useRef, useState } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { BookingsBarChart } from "./bookings-bar-chart"
import { useBookingsSummary, useBookingsList } from "../hooks/use-bookings"
import { BookingDetailDialog } from "./booking-detail-dialog"
import { BookingsFilterPopover, type BookingFilters } from "./bookings-filter-popover"
import { CancelBookingDialog } from "./cancel-booking-dialog"
import type { Booking } from "../types"
import { BookingsTable } from "./bookings-table"
import { CalendarDays, ChevronDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const EMPTY_FILTERS: BookingFilters = { statuses: [], spaceTypes: [], dateFrom: "", dateTo: "" }

const CURRENT_YEAR = new Date().getFullYear()
const AVAILABLE_YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]

export function BookingsContent() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<BookingFilters>(EMPTY_FILTERS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: summary, isLoading: summaryLoading } = useBookingsSummary(selectedYear)
  const { data: list, isLoading: listLoading } = useBookingsList(page, filters)

  const handleFiltersChange = (f: BookingFilters) => { setFilters(f); setPage(1) }

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
            <Icon name="exportSquareOutline" size={15} />
            Export CSV
          </Button>
        </div>

        {/* ── Summary Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

          {/* Active bookings */}
          <InsetCard title="Active bookings" className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-12 bg-gray-200" />
                <Skeleton className="h-4 w-28 bg-gray-200" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.activeBookings ?? 0}
                trend={summary?.activeBookings === 0 ? "No bookings yet" : summary?.activeBookingsTrend}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* Check-ins today */}
          <InsetCard title="Check-ins today" className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-12 bg-gray-200" />
                <Skeleton className="h-4 w-28 bg-gray-200" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.checkInsToday ?? 0}
                trend={summary?.checkInsToday === 0 ? "No bookings yet" : summary?.checkInsTrend}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* Bookings this year */}
          <InsetCard
            className="bg-[#F2F2F7]"
            insetClassName="bg-white"
            title={
              summaryLoading
                ? <Skeleton className="h-4 w-40 bg-gray-200" />
                : <span className="text-[15px] font-medium text-secondary-foreground">{summary?.bookingsThisYear ?? 0} bookings this year</span>
            }
            headerExtra={
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setYearDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
                >
                  {selectedYear}
                  <ChevronDown className={cn("size-4 transition-transform duration-150", yearDropdownOpen && "rotate-180")} />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden min-w-[90px]">
                    {AVAILABLE_YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); setYearDropdownOpen(false) }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                          year === selectedYear ? "font-semibold text-primary" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          >
            {summaryLoading ? (
              <Skeleton className="h-[90px] w-full bg-gray-200 rounded-xl" />
            ) : (
              <BookingsBarChart data={summary?.monthlyData ?? []} />
            )}
          </InsetCard>
        </div>

        {/* ── Active Bookings Table ────────────────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Active bookings</h4>
            <BookingsFilterPopover value={filters} onChange={handleFiltersChange} />
          </div>

          {!listLoading && bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-[72px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <CalendarDays className="size-9 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-[16px] font-semibold text-gray-900 dark:text-white">No bookings</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">No bookings has been made yet</p>
            </div>
          ) : (
            <BookingsTable
              bookings={bookings}
              isLoading={listLoading}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onView={setSelectedBooking}
            />
          )}
        </div>
      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(o) => { if (!o) setSelectedBooking(null) }}
        onCancelRequest={() => { setSelectedBooking(null); setCancelOpen(true) }}
      />

      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={async () => setCancelOpen(false)}
      />
    </div>
  )
}
