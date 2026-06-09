export type BookingPaymentStatus = "paid" | "pending" | "cancelled" | "failed"

export interface Booking {
  id: string
  clientName: string
  spaceType: string
  checkIn: string
  checkOut: string
  amount: string
  paymentStatus: BookingPaymentStatus
}

export interface BookingsThisYearData {
  month: string
  count: number
}

export interface BookingsSummary {
  activeBookings: number
  activeBookingsTrend: string
  checkInsToday: number
  checkInsTrend: string
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
