import type { ClientsSummary, ClientsListResponse, Client, ClientDetail } from "../types"
import type { ClientFilters } from "../components/clients-filter-popover"
import type { BookingFilters } from "@/features/bookings/components/bookings-filter-popover"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const YEARLY_DATA: Record<number, number[]> = {
  2020: [3, 5, 4, 6, 8, 5, 7, 9, 6, 10, 7, 4],
  2021: [5, 7, 6, 9, 11, 8, 10, 12, 9, 13, 10, 6],
  2022: [7, 9, 8, 12, 14, 10, 13, 15, 12, 16, 12, 8],
  2023: [9, 12, 11, 15, 18, 13, 16, 19, 15, 20, 15, 10],
  2024: [12, 15, 14, 19, 22, 17, 20, 24, 19, 25, 18, 12],
  2025: [15, 19, 18, 23, 27, 21, 25, 29, 23, 30, 22, 15],
  2026: [18, 22, 21, 28, 20, 16, 24, 30, 26, 34, 19, 8],
}

const ALL_CLIENTS: Client[] = [
  { id: "00001", name: "Adaeze Okonkwo", email: "adaezeokonkwo...", space: "Conference Room", status: "active",   joinedDate: "May 12, 2026" },
  { id: "00002", name: "Funmi Adeyemi",  email: "funmiadayemi@...", space: "Private Office A", status: "active",   joinedDate: "May 24, 2026" },
  { id: "00003", name: "Emeka Nwosu",    email: "emeka.nwosu@...",  space: "Open Desk 3",     status: "inactive", joinedDate: "Apr 10, 2026" },
  { id: "00004", name: "Tolu Badmus",    email: "tolu.badmus@...",  space: "Penthouse B",     status: "active",   joinedDate: "Jun 01, 2026" },
  { id: "00005", name: "Chidi Okafor",   email: "chidi.okafor@...", space: "Boardroom 1",     status: "active",   joinedDate: "Jun 05, 2026" },
  { id: "00006", name: "Ngozi Eze",      email: "ngozi.eze@...",    space: "Office Suite 2",  status: "inactive", joinedDate: "Mar 20, 2026" },
]

const PAGE_SIZE = 5

const CLIENT_PHONES: Record<string, string> = {
  "00001": "+234 9138407481",
  "00002": "+234 8023456789",
  "00003": "+234 7034567890",
  "00004": "+234 9045678901",
  "00005": "+234 8156789012",
  "00006": "+234 7067890123",
}

const CLIENT_EMAILS: Record<string, string> = {
  "00001": "adaezeokonkwo@gmail.com",
  "00002": "funmiadeyemi@gmail.com",
  "00003": "emeka.nwosu@gmail.com",
  "00004": "tolu.badmus@gmail.com",
  "00005": "chidi.okafor@gmail.com",
  "00006": "ngozi.eze@gmail.com",
}

const BOOKING_HISTORY_PAGE_SIZE = 5

const CLIENT_BOOKINGS: Record<string, import("../types").ClientBookingHistory[]> = {
  "00001": [
    { id: "00001", space: "Conference R...", spaceType: "Office",   checkIn: "May 12, 2026", checkOut: "May 12, 2026", amount: "₦30,000",  paymentStatus: "paid" },
    { id: "00002", space: "Private Office...", spaceType: "Shortlet", checkIn: "May 24, 2026", checkOut: "May 24, 2026", amount: "₦300,000", paymentStatus: "paid" },
    { id: "00003", space: "Boardroom 1",      spaceType: "Office",   checkIn: "Apr 10, 2026", checkOut: "Apr 11, 2026", amount: "₦50,000",  paymentStatus: "paid" },
    { id: "00004", space: "Open Desk 3",      spaceType: "Hot desk", checkIn: "Mar 05, 2026", checkOut: "Mar 05, 2026", amount: "₦10,000",  paymentStatus: "pending" },
    { id: "00005", space: "Penthouse B",      spaceType: "Shortlet", checkIn: "Feb 14, 2026", checkOut: "Feb 21, 2026", amount: "₦700,000", paymentStatus: "paid" },
    { id: "00006", space: "Conference R...",  spaceType: "Office",   checkIn: "Jan 20, 2026", checkOut: "Jan 20, 2026", amount: "₦30,000",  paymentStatus: "cancelled" },
    { id: "00007", space: "Office Suite 2",   spaceType: "Office",   checkIn: "Jan 05, 2026", checkOut: "Jan 06, 2026", amount: "₦60,000",  paymentStatus: "paid" },
    { id: "00008", space: "Boardroom 1",      spaceType: "Office",   checkIn: "Dec 18, 2025", checkOut: "Dec 18, 2025", amount: "₦50,000",  paymentStatus: "paid" },
  ],
  "00002": [
    { id: "00009", space: "Private Office A", spaceType: "Office",   checkIn: "May 24, 2026", checkOut: "May 30, 2026", amount: "₦180,000", paymentStatus: "paid" },
    { id: "00010", space: "Boardroom 1",      spaceType: "Office",   checkIn: "Apr 15, 2026", checkOut: "Apr 15, 2026", amount: "₦50,000",  paymentStatus: "paid" },
    { id: "00011", space: "Open Desk 2",      spaceType: "Hot desk", checkIn: "Mar 10, 2026", checkOut: "Mar 10, 2026", amount: "₦10,000",  paymentStatus: "pending" },
  ],
  "00003": [
    { id: "00012", space: "Open Desk 3",      spaceType: "Hot desk", checkIn: "Apr 10, 2026", checkOut: "Apr 10, 2026", amount: "₦10,000",  paymentStatus: "cancelled" },
    { id: "00013", space: "Conference R...",  spaceType: "Office",   checkIn: "Mar 20, 2026", checkOut: "Mar 20, 2026", amount: "₦30,000",  paymentStatus: "paid" },
  ],
  "00004": [
    { id: "00014", space: "Penthouse B",      spaceType: "Shortlet", checkIn: "Jun 01, 2026", checkOut: "Jun 07, 2026", amount: "₦700,000", paymentStatus: "paid" },
    { id: "00015", space: "Office Suite 2",   spaceType: "Office",   checkIn: "May 05, 2026", checkOut: "May 06, 2026", amount: "₦60,000",  paymentStatus: "paid" },
    { id: "00016", space: "Boardroom 1",      spaceType: "Office",   checkIn: "Apr 22, 2026", checkOut: "Apr 22, 2026", amount: "₦50,000",  paymentStatus: "failed" },
  ],
  "00005": [
    { id: "00017", space: "Boardroom 1",      spaceType: "Office",   checkIn: "Jun 05, 2026", checkOut: "Jun 05, 2026", amount: "₦50,000",  paymentStatus: "paid" },
    { id: "00018", space: "Conference R...",  spaceType: "Office",   checkIn: "May 18, 2026", checkOut: "May 18, 2026", amount: "₦30,000",  paymentStatus: "pending" },
  ],
  "00006": [
    { id: "00019", space: "Office Suite 2",   spaceType: "Office",   checkIn: "Mar 20, 2026", checkOut: "Mar 22, 2026", amount: "₦120,000", paymentStatus: "cancelled" },
  ],
}

export const clientsMockService = {
  getSummary: async (year: number): Promise<ClientsSummary> => {
    const counts = YEARLY_DATA[year] ?? YEARLY_DATA[2026]
    const total = counts.reduce((a, b) => a + b, 0)
    return {
      newThisMonth: 20,
      newThisMonthLabel: "New clients this month (May)",
      newThisMonthTrend: "+ 16 more than April",
      activeThisMonth: 45,
      activeThisMonthLabel: "Active clients this month (May)",
      activeThisMonthTrend: "+9 from yesterday",
      clientsThisYear: total,
      currentYear: year,
      monthlyData: MONTHS.map((month, i) => ({ month, count: counts[i] })),
    }
  },

  getClients: async (page = 1, filters?: ClientFilters): Promise<ClientsListResponse> => {
    let clients = [...ALL_CLIENTS]
    if (filters) {
      if (filters.statuses.length)
        clients = clients.filter((c) => filters.statuses.includes(c.status))
      if (filters.dateFrom)
        clients = clients.filter((c) => new Date(c.joinedDate) >= new Date(filters.dateFrom))
      if (filters.dateTo)
        clients = clients.filter((c) => new Date(c.joinedDate) <= new Date(filters.dateTo))
    }
    const totalPages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    return {
      clients: clients.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: page,
      totalCount: clients.length,
    }
  },

  getClientById: async (id: string, bookingPage = 1, filters?: BookingFilters): Promise<ClientDetail | null> => {
    const client = ALL_CLIENTS.find((c) => c.id === id)
    if (!client) return null
    let bookings = CLIENT_BOOKINGS[id] ?? []

    if (filters) {
      if (filters.statuses.length)
        bookings = bookings.filter((b) => filters.statuses.includes(b.paymentStatus))
      if (filters.spaceTypes.length)
        bookings = bookings.filter((b) => filters.spaceTypes.includes(b.spaceType.toLowerCase()))
      if (filters.dateFrom)
        bookings = bookings.filter((b) => new Date(b.checkIn) >= new Date(filters.dateFrom))
      if (filters.dateTo)
        bookings = bookings.filter((b) => new Date(b.checkOut) <= new Date(filters.dateTo))
    }

    const totalPages = Math.max(1, Math.ceil(bookings.length / BOOKING_HISTORY_PAGE_SIZE))
    const start = (bookingPage - 1) * BOOKING_HISTORY_PAGE_SIZE
    return {
      ...client,
      email: CLIENT_EMAILS[id] ?? client.email,
      phone: CLIENT_PHONES[id] ?? "",
      bookingHistory: bookings.slice(start, start + BOOKING_HISTORY_PAGE_SIZE),
      bookingHistoryTotalPages: totalPages,
    }
  },
}
