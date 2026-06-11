"use client"

import { useState } from "react"
import { Calendar } from "@/shared/components/ui/calendar"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Icon } from "@/shared/components/ui/icon"
import { Pagination } from "@/shared/components/ui/pagination"
import { cn } from "@/shared/lib/utils"
import { useSchedule } from "../hooks/use-schedule"
import { SlotGroup } from "./slot-group"

export function ScheduleContent() {
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 10))
  const { data, isLoading } = useSchedule(page)

  const days  = data?.days       ?? []
  const total = data?.totalPages ?? 1
  const month = data?.monthLabel ?? ""

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daily and weekly client space assignments</p>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Left: day list ───────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-base font-bold text-gray-900">{month}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Previous"
                >
                  <Icon name="chevronLeft" size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(total, p + 1))}
                  className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Next"
                >
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>
            </div>

            {/* Day cards */}
            <div className="flex flex-col gap-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[120px] w-full rounded-2xl bg-gray-100" />
                  ))
                : days.map(day => (
                    <div key={`${day.day}-${day.month}`} className="flex flex-col gap-2">
                      {/* Day label */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{day.day}</span>
                        <span className="text-[11px] font-semibold text-gray-400 tracking-widest">
                          {day.month}, {day.weekday}
                        </span>
                      </div>
                      <SlotGroup slots={day.slots} />
                    </div>
                  ))
              }
            </div>

            {/* Pagination */}
            {!isLoading && total > 1 && (
              <div className="mt-6">
                <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
              </div>
            )}
          </div>

          {/* ── Right: mini calendar ─────────────────────────── */}
          <div className="w-[280px] shrink-0 rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={d => d && setSelectedDate(d)}
              className="p-4"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
