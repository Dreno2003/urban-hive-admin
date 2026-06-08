import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboard-service"
import { type SpaceOccupancyResponse } from "../types"

/**
 * Custom hook to retrieve space category occupancy data.
 * Uses TanStack Query for caching, loading states, and automatic background refetching.
 */
export function useSpaceOccupancy() {
  return useQuery<SpaceOccupancyResponse, Error>({
    queryKey: ["dashboard", "spaceOccupancy"],
    queryFn: () => dashboardService.getSpaceOccupancy(),
    staleTime: 5 * 60 * 1000, // 5 minutes caching stale time
  })
}
