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
