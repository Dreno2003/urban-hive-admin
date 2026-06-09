import type { BookingsSummary, BookingsListResponse, Booking } from "../types"
import type { BookingFilters } from "../components/bookings-filter-popover"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const YEARLY_DATA: Record<number, number[]> = {
  2024: [8, 14, 19, 22, 17, 12, 20, 25, 21, 28, 15, 6],
  2025: [10, 16, 20, 25, 18, 13, 22, 27, 24, 31, 17, 7],
  2026: [12, 18, 22, 28, 20, 15, 24, 30, 26, 34, 19, 8],
}

const ALL_BOOKINGS: Booking[] = [
  { id: "00001", clientName: "Adaeze Okonkwo", clientPhone: "+234 9138407481", clientEmail: "adaezeokonkwo@gmail.com", space: "Conference Room", spaceType: "Office",    checkIn: "2026-05-12", checkOut: "2026-05-20", duration: "2 hrs/ day", amount: "₦30,000",  paymentStatus: "paid" },
  { id: "00002", clientName: "Funmi Adeyemi",  clientPhone: "+234 8023456789", clientEmail: "funmi.adeyemi@gmail.com",  space: "Studio A",       spaceType: "Shortlet",  checkIn: "2026-05-24", checkOut: "2026-05-24", duration: "1 day",     amount: "₦300,000", paymentStatus: "cancelled", cancelledBy: "Taiwo James", cancellationReason: "Client asked for the booking reservation to be cancelled." },
  { id: "00003", clientName: "Emeka Nwosu",    clientPhone: "+234 7011234567", clientEmail: "emeka.nwosu@gmail.com",    space: "Open Desk 3",    spaceType: "Office",    checkIn: "2026-06-01", checkOut: "2026-06-03", duration: "3 days",    amount: "₦60,000",  paymentStatus: "pending" },
  { id: "00004", clientName: "Tolu Badmus",    clientPhone: "+234 8134567890", clientEmail: "tolu.badmus@gmail.com",    space: "Penthouse B",    spaceType: "Shortlet",  checkIn: "2026-06-05", checkOut: "2026-06-07", duration: "2 days",    amount: "₦150,000", paymentStatus: "paid" },
  { id: "00005", clientName: "Chidi Okafor",   clientPhone: "+234 9025678901", clientEmail: "chidi.okafor@gmail.com",   space: "Boardroom 1",    spaceType: "Boardroom", checkIn: "2026-06-10", checkOut: "2026-06-10", duration: "4 hrs",     amount: "₦45,000",  paymentStatus: "pending" },
  { id: "00006", clientName: "Ngozi Eze",      clientPhone: "+234 8036789012", clientEmail: "ngozi.eze@gmail.com",      space: "Office Suite 2", spaceType: "Office",    checkIn: "2026-06-12", checkOut: "2026-06-14", duration: "2 days",    amount: "₦90,000",  paymentStatus: "paid" },
]

const PAGE_SIZE = 4

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const bookingsMockService = {
  getSummary: async (year: number): Promise<BookingsSummary> => {
    const counts = YEARLY_DATA[year] ?? YEARLY_DATA[2026]
    const total = counts.reduce((a, b) => a + b, 0)
    return {
      activeBookings: 28,
      activeBookingsTrend: "+2 this week",
      checkInsToday: 7,
      checkInsTrend: "↑ 2 more than yesterday",
      bookingsThisYear: total,
      currentYear: year,
      monthlyData: MONTHS.map((month, i) => ({ month, count: counts[i] })),
    }
  },

  getBookings: async (page = 1, filters?: BookingFilters): Promise<BookingsListResponse> => {
    let results = ALL_BOOKINGS

    if (filters) {
      if (filters.statuses.length)
        results = results.filter((b) => filters.statuses.includes(b.paymentStatus))
      if (filters.spaceTypes.length)
        results = results.filter((b) => filters.spaceTypes.includes(b.spaceType.toLowerCase()))
      if (filters.dateFrom)
        results = results.filter((b) => b.checkIn >= filters.dateFrom)
      if (filters.dateTo)
        results = results.filter((b) => b.checkOut <= filters.dateTo)
    }

    const totalCount = results.length
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    const bookings = results.slice(start, start + PAGE_SIZE).map((b) => ({
      ...b,
      checkIn: fmt(b.checkIn),
      checkOut: fmt(b.checkOut),
    }))

    return { bookings, totalPages, currentPage: page, totalCount }
  },
}
