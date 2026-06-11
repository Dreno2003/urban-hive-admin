"use client"

import { useState } from "react"
import { Calendar } from "@/shared/components/ui/calendar"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Icon } from "@/shared/components/ui/icon"
import { Pagination } from "@/shared/components/ui/pagination"
import { useSchedule } from "../hooks/use-schedule"
import { SlotGroup } from "./slot-group"
import { Separator } from "@/shared/components/ui/separator"

const MIN_YEAR = 2025

export function ScheduleContent() {
  const today = new Date()
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [page, setPage] = useState(1)

  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()

  const { data, isLoading } = useSchedule(year, month, page)

  const days = data?.days ?? []
  const total = data?.totalPages ?? 1
  const label = data?.monthLabel ?? ""

  const handleMonthChange = (newMonth: Date) => {
    // Clamp to MIN_YEAR and not beyond far future
    if (newMonth.getFullYear() < MIN_YEAR) return
    setCalendarMonth(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1))
    setPage(1)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    // If date is in a different month, navigate there
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      handleMonthChange(date)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <div className="w-full container-wrapper pt-8 pb-42 mt-[76px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daily and weekly client space assignments</p>
        </div>

        <div className="flex  gap-6 items-start">

          {/* ── Left: day list ───────────────────────────────── */}
          <div className="border dp-4  rounded-3xl flex-1 min-w-0">
            {/* Month nav */}
            <div className="border-b  p-4 flex items-center justify-between mb-5">
              <span className="text-base font-bold text-gray-900">{label}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMonthChange(new Date(year, month - 1, 1))}
                  disabled={year <= MIN_YEAR && month === 0}
                  className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-30"
                  aria-label="Previous month"
                >
                  <Icon name="chevronLeft" size={16} />
                </button>
                <button
                  onClick={() => handleMonthChange(new Date(year, month + 1, 1))}
                  className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Next month"
                >
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>
            </div>

            {/* Day cards */}
            <div className="flex p-4 flex-col gap-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] w-full rounded-2xl bg-gray-100" />
                ))
                : days.map(day => (
                  <div key={`${day.day}-${day.month}`} className="border p-4 rounded-3xl flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">{day.day}</span>
                      <span className="text-[11px] font-semibold text-gray-400 tracking-widest">
                        {day.month}, {day.weekday}
                      </span>
                    </div>

                    {/* <Separator className="my-2" orientation="vertical" /> */}
                    <Separator className="my-2" />

                    <SlotGroup   slots={day.slots} />
                  </div>
                ))
              }
            </div>

            {/* Pagination */}
            {!isLoading && total > 1 && (
              <div className="mt-6 px-4">
                <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
              </div>
            )}
          </div>

          {/* ── Right: mini calendar ─────────────────────────── */}
          <div className="w-[320px] shrink-0 rounded-[24px] border border-gray-100  overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={calendarMonth}
              
              onMonthChange={handleMonthChange}
              className="p-4"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
