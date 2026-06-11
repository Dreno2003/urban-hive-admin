import { useQuery } from "@tanstack/react-query"
import { reportsMockService } from "../services/reports-mock.service"

export function useReportsSummary() {
  return useQuery({
    queryKey: ["reports-summary"],
    queryFn: () => reportsMockService.getSummary(),
  })
}

export function useReportsList(page = 1) {
  return useQuery({
    queryKey: ["reports-list", page],
    queryFn: () => reportsMockService.getReports(page),
  })
}
