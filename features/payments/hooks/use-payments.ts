import { useQuery } from "@tanstack/react-query"
import { paymentsMockService } from "../services/payments-mock.service"
import type { PaymentFilters } from "../components/payments-filter-popover"

export function usePaymentsSummary(year: number) {
  return useQuery({
    queryKey: ["payments-summary", year],
    queryFn: () => paymentsMockService.getSummary(year),
  })
}

export function usePaymentsList(page = 1, filters?: PaymentFilters) {
  return useQuery({
    queryKey: ["payments-list", page, filters],
    queryFn: () => paymentsMockService.getPayments(page, filters),
  })
}
