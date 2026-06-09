import { useQuery } from "@tanstack/react-query"
import { bookingsMockService } from "../services/bookings-mock.service"

export function useBookingsSummary() {
  return useQuery({
    queryKey: ["bookings-summary"],
    queryFn: bookingsMockService.getSummary,
  })
}

export function useBookingsList(page = 1) {
  return useQuery({
    queryKey: ["bookings-list", page],
    queryFn: () => bookingsMockService.getBookings(page),
  })
}
