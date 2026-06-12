export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"

export interface Payment {
  id: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  spaceName: string
  spaceType: "Office" | "Shortlet" | "Boardroom"
  amount: string
  billingPeriod: string
  paymentStatus: PaymentStatus
  paymentMethod?: string
  transactionRef?: string
  datePaid?: string
  duration?: string
  cancellationPeriod?: string
  cancellationTimeLeft?: string
}

export interface PaymentsMonthlyData {
  month: string
  amount: number
  formattedAmount: string
}

export interface PaymentsSummary {
  paidToday: string
  paidTodayTrend: string
  allPaymentsTotal: string
  allPaymentsCountText: string
  paymentsThisYearTotalText: string
  currentYear: number
  monthlyData: PaymentsMonthlyData[]
}

export interface PaymentsListResponse {
  payments: Payment[]
  totalPages: number
  currentPage: number
  totalCount: number
}
