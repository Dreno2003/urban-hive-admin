import { apiClient } from "@/shared/lib/api-client"
import { type DashboardSummaryResponse } from "../types"

export const dashboardService = {
  /**
   * Fetches the summary metrics for the admin dashboard.
   * Currently returns typed mock data with a simulated network delay.
   */
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    // In a real implementation:
    // return apiClient.get<DashboardSummaryResponse>("/dashboard/summary");

    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      activeClients: {
        value: 12,
        trend: "↑ 2 this week",
        trendType: "up",
      },
      todaysBookings: {
        value: 15,
        trend: "↑ 2 this week",
        trendType: "up",
      },
      revenue: {
        value: "₦2.4M",
        trend: "↑ 18% vs April",
        trendType: "up",
        currencySymbol: "₦",
        rawAmount: 2400000,
        month: "May",
      },
    }
  },
}
