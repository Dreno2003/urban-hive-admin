import { useQuery } from "@tanstack/react-query"
import { clientsMockService } from "../services/clients-mock.service"
import type { ClientFilters } from "../components/clients-filter-popover"
import type { BookingFilters } from "@/features/bookings/components/bookings-filter-popover"

export function useClientsSummary(year: number) {
  return useQuery({
    queryKey: ["clients-summary", year],
    queryFn: () => clientsMockService.getSummary(year),
  })
}

export function useClientsList(page = 1, filters?: ClientFilters) {
  return useQuery({
    queryKey: ["clients-list", page, filters],
    queryFn: () => clientsMockService.getClients(page, filters),
  })
}

export function useClientDetail(id: string, bookingPage = 1, filters?: BookingFilters) {
  return useQuery({
    queryKey: ["client-detail", id, bookingPage, filters],
    queryFn: () => clientsMockService.getClientById(id, bookingPage, filters),
    enabled: !!id,
  })
}
