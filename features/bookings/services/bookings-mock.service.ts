import type { BookingsSummary, BookingsListResponse } from "../types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const bookingsMockService = {
  getSummary: async (): Promise<BookingsSummary> => ({
    activeBookings: 0,
    checkInsToday: 0,
    bookingsThisYear: 0,
    currentYear: new Date().getFullYear(),
    monthlyData: MONTHS.map((month) => ({ month, count: 0 })),
  }),

  getBookings: async (_page = 1): Promise<BookingsListResponse> => ({
    bookings: [],
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,
  }),
}
