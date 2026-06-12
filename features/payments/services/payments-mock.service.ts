import type { PaymentsSummary, PaymentsListResponse, Payment } from "../types"
import type { PaymentFilters } from "../components/payments-filter-popover"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const YEARLY_DATA: Record<number, number[]> = {
  2024: [120000, 180000, 220000, 1000000, 350000, 200000, 90000, 500000, 220000, 400000, 90000, 90000],
  2025: [140000, 190000, 250000, 1200000, 380000, 220000, 95000, 550000, 240000, 420000, 95000, 95000],
  2026: [150000, 200000, 300000, 1500000, 400000, 250000, 100000, 600000, 250000, 450000, 100000, 100000],
}

const ALL_PAYMENTS: Payment[] = [
  {
    id: "00001",
    clientName: "Adaeze Okonkwo",
    clientPhone: "+234 9138407481",
    clientEmail: "adaezeokonkwo@gmail.com",
    spaceName: "Conference Room",
    spaceType: "Office",
    amount: "₦30,000",
    billingPeriod: "May 5 – Jun 1, 2026",
    paymentStatus: "paid",
    paymentMethod: "Bank transfer",
    transactionRef: "TXN-849204859",
    datePaid: "May 20, 2026",
    duration: "2 hrs/ day",
    cancellationPeriod: "1 hour",
    cancellationTimeLeft: "58:56",
  },
  {
    id: "00002",
    clientName: "Emeka Dike",
    clientPhone: "+234 8023456789",
    clientEmail: "emeka.dike@gmail.com",
    spaceName: "Private office A",
    spaceType: "Shortlet",
    amount: "₦120,000/night",
    billingPeriod: "May 5 – Jun 1, 2026",
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer",
    transactionRef: "TXN-902348501",
    datePaid: "2026-05-05",
    duration: "1 night",
    cancellationPeriod: "24 hours",
    cancellationTimeLeft: "23:45:00",
  },
  {
    id: "00003",
    clientName: "Tolu Badmus",
    clientPhone: "+234 8134567890",
    clientEmail: "tolu.badmus@gmail.com",
    spaceName: "Penthouse B",
    spaceType: "Shortlet",
    amount: "₦80,000/night",
    billingPeriod: "Jun 7 – Jun 10, 2026",
    paymentStatus: "pending",
    paymentMethod: "Card (Visa)",
    transactionRef: "TXN-329840192",
    datePaid: "—",
    duration: "3 nights",
    cancellationPeriod: "—",
    cancellationTimeLeft: "—",
  },
  {
    id: "00004",
    clientName: "Chidi Okafor",
    clientPhone: "+234 9025678901",
    clientEmail: "chidi.okafor@gmail.com",
    spaceName: "Boardroom 1",
    spaceType: "Boardroom",
    amount: "₦25,000/day",
    billingPeriod: "Jun 3 – Jun 4, 2026",
    paymentStatus: "failed",
    paymentMethod: "Card (Verve)",
    transactionRef: "TXN-110293485",
    datePaid: "—",
    duration: "1 day",
    cancellationPeriod: "—",
    cancellationTimeLeft: "—",
  },
  {
    id: "00005",
    clientName: "Ngozi Eze",
    clientPhone: "+234 8036789012",
    clientEmail: "ngozi.eze@gmail.com",
    spaceName: "Office Suite 2",
    spaceType: "Office",
    amount: "₦18,000/day",
    billingPeriod: "Jun 8 – Jun 15, 2026",
    paymentStatus: "refunded",
    paymentMethod: "Bank Transfer",
    transactionRef: "TXN-492038471",
    datePaid: "2026-06-08",
    duration: "7 days",
    cancellationPeriod: "—",
    cancellationTimeLeft: "—",
  },
]

const PAGE_SIZE = 4

const formatCurrency = (val: number) => {
  if (val >= 1000000) {
    return `₦${(val / 1000000).toFixed(1)}M`
  } else if (val >= 1000) {
    return `₦${(val / 1000).toFixed(0)}K`
  }
  return `₦${val}`
}

export const paymentsMockService = {
  getSummary: async (year: number): Promise<PaymentsSummary> => {
    // Artificial latency
    await new Promise((r) => setTimeout(r, 100))
    const counts = YEARLY_DATA[year] ?? YEARLY_DATA[2026]
    const totalAmount = counts.reduce((a, b) => a + b, 0)
    
    return {
      paidToday: "₦175,000",
      paidTodayTrend: "+5 from yesterday",
      allPaymentsTotal: "₦10.8M",
      allPaymentsCountText: "From 88 payments",
      paymentsThisYearTotalText: `${formatCurrency(totalAmount)} paid this year`,
      currentYear: year,
      monthlyData: MONTHS.map((month, i) => ({
        month,
        amount: counts[i],
        formattedAmount: formatCurrency(counts[i]),
      })),
    }
  },

  getPayments: async (page = 1, filters?: PaymentFilters): Promise<PaymentsListResponse> => {
    // Artificial latency
    await new Promise((r) => setTimeout(r, 150))
    let results = ALL_PAYMENTS

    if (filters) {
      if (filters.statuses.length) {
        results = results.filter((p) => filters.statuses.includes(p.paymentStatus))
      }
      if (filters.spaceTypes.length) {
        results = results.filter((p) => filters.spaceTypes.includes(p.spaceType.toLowerCase()))
      }
      if (filters.dateFrom) {
        // Assume simple check against mock date formats or date range
        results = results.filter((p) => !p.datePaid || p.datePaid >= filters.dateFrom)
      }
      if (filters.dateTo) {
        results = results.filter((p) => !p.datePaid || p.datePaid <= filters.dateTo)
      }
    }

    const totalCount = results.length
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    const payments = results.slice(start, start + PAGE_SIZE)

    return { payments, totalPages, currentPage: page, totalCount }
  },
}
