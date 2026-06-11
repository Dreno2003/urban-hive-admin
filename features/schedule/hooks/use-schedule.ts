import { useQuery } from "@tanstack/react-query"
import { scheduleMockService } from "../services/schedule-mock.service"

export function useSchedule(year: number, month: number, page = 1) {
  return useQuery({
    queryKey: ["schedule", year, month, page],
    queryFn: () => scheduleMockService.getSchedule(year, month, page),
    staleTime: 1000 * 60 * 5,
  })
}
