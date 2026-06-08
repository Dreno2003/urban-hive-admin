import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboard-service"
import { type DashboardSummaryResponse } from "../types"

/**
 * Custom hook to retrieve dashboard summary metrics.
 * Uses TanStack Query for optimal caching, loading states, and automatic background refetching.
 */
export function useDashboardSummary() {
  return useQuery<DashboardSummaryResponse, Error>({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes caching stale time
  })
}
