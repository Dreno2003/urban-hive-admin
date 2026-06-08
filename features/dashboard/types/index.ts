export interface DashboardMetric {
  value: number | string
  trend: string
  trendType: "up" | "down" | "neutral"
}

export interface DashboardSummaryResponse {
  activeClients: DashboardMetric
  todaysBookings: DashboardMetric
  revenue: DashboardMetric & {
    currencySymbol: string
    rawAmount: number
    month: string
  }
}

export interface UpcomingBooking {
  id: string
  clientName: string
  time: string
  accentColor?: string
}

export interface UpcomingBookingsResponse {
  totalCount: number
  bookings: UpcomingBooking[]
}

export interface SpaceOccupancy {
  id: string
  name: string
  occupied: number
  capacity: number
  free: number
}

export type SpaceOccupancyResponse = SpaceOccupancy[]
