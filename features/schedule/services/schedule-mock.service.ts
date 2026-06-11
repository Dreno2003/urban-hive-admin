import type { ScheduleListResponse } from "../types"

const COLORS = ["orange", "green", "blue", "purple"] as const

function makeSlots(dayIndex: number) {
  return ["8:00 AM", "10:00 AM", "12:00 PM"].map((time, i) => ({
    id: `slot-${dayIndex}-${i}`,
    time,
    clientName: "Adaeze Okonkwo",
    space: "Conference Room",
    checkIn: "May 10, 2026",
    checkOut: "May 15, 2026",
    onboardingGuide: "Read onboarding material",
    color: COLORS[dayIndex % COLORS.length],
  }))
}

const PAGES: ScheduleListResponse[] = [
  {
    monthLabel: "May 2026",
    currentPage: 1,
    totalPages: 8,
    days: [
      { day: 10, month: "MAY", weekday: "MONDAY",    slots: makeSlots(0) },
      { day: 11, month: "MAY", weekday: "TUESDAY",   slots: makeSlots(1) },
      { day: 12, month: "MAY", weekday: "WEDNESDAY", slots: makeSlots(2) },
    ],
  },
  {
    monthLabel: "May 2026",
    currentPage: 2,
    totalPages: 8,
    days: [
      { day: 13, month: "MAY", weekday: "THURSDAY", slots: makeSlots(3) },
      { day: 14, month: "MAY", weekday: "FRIDAY",   slots: makeSlots(0) },
      { day: 15, month: "MAY", weekday: "SATURDAY", slots: makeSlots(1) },
    ],
  },
]

export const scheduleMockService = {
  getSchedule: async (page = 1): Promise<ScheduleListResponse> => {
    return PAGES[page - 1] ?? { ...PAGES[0], currentPage: page }
  },
}
