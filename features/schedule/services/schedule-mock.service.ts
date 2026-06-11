import type { ScheduleListResponse, SlotColor } from "../types"

const COLORS: SlotColor[] = ["orange", "green", "blue", "purple"]
const PAGE_SIZE = 3 // days per page

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function weekdayName(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
}

function monthName(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function makeSlots(dayIndex: number, colorIndex: number) {
  return ["8:00 AM", "10:00 AM", "12:00 PM"].map((time, i) => ({
    id: `slot-${dayIndex}-${i}`,
    time,
    clientName: "Adaeze Okonkwo",
    space: "Conference Room",
    checkIn: "May 10, 2026",
    checkOut: "May 15, 2026",
    onboardingGuide: "Read onboarding material",
    color: COLORS[colorIndex % COLORS.length],
  }))
}

export const scheduleMockService = {
  getSchedule: async (year: number, month: number, page = 1): Promise<ScheduleListResponse> => {
    const total = daysInMonth(year, month)
    const totalPages = Math.ceil(total / PAGE_SIZE)
    const safePage = Math.min(Math.max(1, page), totalPages)
    const startDay = (safePage - 1) * PAGE_SIZE + 1

    const days = Array.from({ length: PAGE_SIZE }, (_, i) => {
      const dayNum = startDay + i
      if (dayNum > total) return null
      const date = new Date(year, month, dayNum)
      return {
        day: dayNum,
        month: monthName(date),
        weekday: weekdayName(date),
        slots: makeSlots(dayNum, i),
      }
    }).filter(Boolean) as ScheduleListResponse["days"]

    return { days, totalPages, currentPage: safePage, monthLabel: monthLabel(year, month) }
  },
}
