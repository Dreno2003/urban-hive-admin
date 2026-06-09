import { useQuery } from "@tanstack/react-query"
import { bookingsMockService } from "../services/bookings-mock.service"
import type { BookingFilters } from "../components/bookings-filter-popover"

export function useBookingsSummary(year: number) {
  return useQuery({
    queryKey: ["bookings-summary", year],
    queryFn: () => bookingsMockService.getSummary(year),
  })
}

export function useBookingsList(page = 1, filters?: BookingFilters) {
  return useQuery({
    queryKey: ["bookings-list", page, filters],
    queryFn: () => bookingsMockService.getBookings(page, filters),
  })
}
