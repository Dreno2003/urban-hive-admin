import { useQuery } from "@tanstack/react-query"
import { clientsMockService } from "../services/clients-mock.service"

export function useClientsSummary(year: number) {
  return useQuery({
    queryKey: ["clients-summary", year],
    queryFn: () => clientsMockService.getSummary(year),
  })
}

export function useClientsList(page = 1) {
  return useQuery({
    queryKey: ["clients-list", page],
    queryFn: () => clientsMockService.getClients(page),
  })
}
