import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboard-service"
import { type RecentPaymentsResponse } from "../types"

/**
 * Custom hook to retrieve recent paginated payments.
 * Uses TanStack Query for caching, loading states, and automatic background refetching.
 */
export function useRecentPayments(page: number = 1) {
  return useQuery<RecentPaymentsResponse, Error>({
    queryKey: ["dashboard", "recentPayments", page],
    queryFn: () => dashboardService.getRecentPayments(page),
    staleTime: 2 * 60 * 1000, // 2 minutes — payments change more frequently
    placeholderData: (prev) => prev, // keep previous page data visible during transitions
  })
}
