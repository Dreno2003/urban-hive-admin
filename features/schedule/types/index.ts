export type SlotColor = "orange" | "green" | "blue" | "purple"

export type ScheduleSlot = {
  id: string
  time: string
  clientName: string
  space: string
  checkIn: string
  checkOut: string
  onboardingGuide: string
  color: SlotColor
}

export type ScheduleDay = {
  day: number
  month: string
  weekday: string
  slots: ScheduleSlot[]
}

export type ScheduleListResponse = {
  days: ScheduleDay[]
  totalPages: number
  currentPage: number
  monthLabel: string
}
