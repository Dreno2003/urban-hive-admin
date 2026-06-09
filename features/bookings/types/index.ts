export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

export interface Booking {
  id: string
  clientName: string
  space: string
  spaceType: string
  dateRange: string
  status: BookingStatus
}

export interface BookingsThisYearData {
  month: string
  count: number
}

export interface BookingsSummary {
  activeBookings: number
  checkInsToday: number
  bookingsThisYear: number
  currentYear: number
  monthlyData: BookingsThisYearData[]
}

export interface BookingsListResponse {
  bookings: Booking[]
  totalPages: number
  currentPage: number
  totalCount: number
}
