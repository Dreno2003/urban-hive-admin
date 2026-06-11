import { useQuery } from "@tanstack/react-query"
import { scheduleMockService } from "../services/schedule-mock.service"

export function useSchedule(page = 1) {
  return useQuery({
    queryKey: ["schedule", page],
    queryFn: () => scheduleMockService.getSchedule(page),
    staleTime: 1000 * 60 * 5,
  })
}
