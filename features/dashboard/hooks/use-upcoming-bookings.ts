import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboard-service"
import { type UpcomingBookingsResponse } from "../types"

/**
 * Custom hook to retrieve today's upcoming bookings.
 * Uses TanStack Query for caching, loading states, and automatic background refetching.
 */
export function useUpcomingBookings() {
  return useQuery<UpcomingBookingsResponse, Error>({
    queryKey: ["dashboard", "upcomingBookings"],
    queryFn: () => dashboardService.getUpcomingBookings(),
    staleTime: 5 * 60 * 1000, // 5 minutes caching stale time
  })
}
