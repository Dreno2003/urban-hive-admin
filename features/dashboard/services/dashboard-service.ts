import { apiClient } from "@/shared/lib/api-client"
import { type DashboardSummaryResponse, type UpcomingBookingsResponse, type SpaceOccupancyResponse, type RecentPaymentsResponse } from "../types"

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

  /**
   * Fetches the list of upcoming bookings for today.
   * Currently returns mock data matching the design.
   */
  getUpcomingBookings: async (): Promise<UpcomingBookingsResponse> => {
    // In a real implementation:
    // return apiClient.get<UpcomingBookingsResponse>("/dashboard/upcoming-bookings");

    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 600))

    return {
      totalCount: 20,
      bookings: [
        {
          id: "1",
          clientName: "Adaeze Okonkwo",
          time: "8:00 AM",
        },
        {
          id: "2",
          clientName: "Adaeze Okonkwo",
          time: "8:00 AM",
        },
      ],
    }
  },

  /**
   * Fetches the workspace category occupancy stats.
   * Currently returns mock data matching the design.
   */
  getSpaceOccupancy: async (): Promise<SpaceOccupancyResponse> => {
    // In a real implementation:
    // return apiClient.get<SpaceOccupancyResponse>("/dashboard/space-occupancy");

    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      { id: "shortlets", name: "Shortlets", occupied: 8, capacity: 10, free: 2 },
      { id: "offices", name: "Offices", occupied: 8, capacity: 10, free: 2 },
      { id: "boardrooms", name: "Boardrooms", occupied: 8, capacity: 10, free: 2 },
    ]
  },

  /**
   * Fetches the paginated list of recent payments.
   * Currently returns typed mock data matching the design.
   */
  getRecentPayments: async (page: number = 1): Promise<RecentPaymentsResponse> => {
    // In a real implementation:
    // return apiClient.get<RecentPaymentsResponse>(`/dashboard/payments?page=${page}`);

    await new Promise((resolve) => setTimeout(resolve, 700))

    return {
      currentPage: page,
      totalPages: 8,
      totalCount: 80,
      payments: [
        {
          id: "1",
          clientName: "Adaeze Okonkwo",
          space: "Private office A",
          spaceType: "Office",
          amount: "₦8,000/day",
          dateRange: "May 5 – Jun 1, 2026",
          status: "paid",
        },
        {
          id: "2",
          clientName: "Emeka Dike",
          space: "Private office A",
          spaceType: "Shortlet",
          amount: "₦120,000/night",
          dateRange: "May 5 – Jun 1, 2026",
          status: "paid",
        },
      ],
    }
  },
}
