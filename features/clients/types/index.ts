export type ClientStatus = "active" | "inactive"

export interface Client {
  id: string
  name: string
  email: string
  space: string
  status: ClientStatus
  joinedDate: string
}

export interface ClientsMonthlyData {
  month: string
  count: number
}

export interface ClientsSummary {
  newThisMonth: number
  newThisMonthLabel: string
  newThisMonthTrend: string
  activeThisMonth: number
  activeThisMonthLabel: string
  activeThisMonthTrend: string
  clientsThisYear: number
  currentYear: number
  monthlyData: ClientsMonthlyData[]
}

export interface ClientsListResponse {
  clients: Client[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export type BookingHistoryPaymentStatus = "paid" | "pending" | "cancelled" | "failed"

export interface ClientBookingHistory {
  id: string
  space: string
  spaceType: string
  checkIn: string
  checkOut: string
  amount: string
  paymentStatus: BookingHistoryPaymentStatus
}

export interface ClientDetail extends Client {
  phone: string
  bookingHistory: ClientBookingHistory[]
  bookingHistoryTotalPages: number
}

export interface ClientDetailResponse {
  client: ClientDetail
}
