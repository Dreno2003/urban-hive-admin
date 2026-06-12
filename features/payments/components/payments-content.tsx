"use client"

import React, { useRef, useState, useEffect } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { PaymentsBarChart } from "./payments-bar-chart"
import { usePaymentsSummary, usePaymentsList } from "../hooks/use-payments"
import { PaymentDetailDialog } from "./payment-detail-dialog"
import { PaymentsFilterPopover, type PaymentFilters } from "./payments-filter-popover"
import type { Payment } from "../types"
import { PaymentsTable } from "./payments-table"
import { ChevronDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const EMPTY_FILTERS: PaymentFilters = { statuses: [], spaceTypes: [], dateFrom: "", dateTo: "" }

const CURRENT_YEAR = new Date().getFullYear()
const AVAILABLE_YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]

export function PaymentsContent() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<PaymentFilters>(EMPTY_FILTERS)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: summary, isLoading: summaryLoading } = usePaymentsSummary(selectedYear)
  const { data: list, isLoading: listLoading } = usePaymentsList(page, filters)

  const handleFiltersChange = (f: PaymentFilters) => {
    setFilters(f)
    setPage(1)
  }

  // Handle clicking outside the year dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const payments = list?.payments ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full px-8 md:px-12 pt-8 pb-12 mt-[76px]">
        {/* ── Page Header ─────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">Payments</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All payments made to Urban Hive</p>
          </div>
          <Button className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2">
            <Icon name="exportSquareOutline" size={15} />
            Export CSV
          </Button>
        </div>

        {/* ── Summary Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {/* Paid today */}
          <InsetCard title="Paid today" className="bg-[#F2F2F7] dark:bg-gray-950" insetClassName="bg-white dark:bg-gray-900">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-24 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.paidToday ?? "₦0"}
                trend={summary?.paidToday === "₦0" ? "No payments" : summary?.paidTodayTrend}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* All payments total */}
          <InsetCard title="All payments total" className="bg-[#F2F2F7] dark:bg-gray-950" insetClassName="bg-white dark:bg-gray-900">
            {summaryLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-24 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : (
              <InsetCard.Metric
                value={summary?.allPaymentsTotal ?? "₦0"}
                trend={summary?.allPaymentsTotal === "₦0" ? "No payments" : summary?.allPaymentsCountText}
                trendType="neutral"
              />
            )}
          </InsetCard>

          {/* Payments this year */}
          <InsetCard
            className="bg-[#F2F2F7] dark:bg-gray-950"
            insetClassName="bg-white dark:bg-gray-900"
            title={
              summaryLoading ? (
                <Skeleton className="h-4 w-40 bg-gray-200 dark:bg-gray-800" />
              ) : (
                <span className="text-[15px] font-medium text-secondary-foreground dark:text-gray-400">
                  {summary?.paymentsThisYearTotalText ?? "0 payments this year"}
                </span>
              )
            }
            headerExtra={
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setYearDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  {selectedYear}
                  <ChevronDown className={cn("size-4 transition-transform duration-150", yearDropdownOpen && "rotate-180")} />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden min-w-[90px]">
                    {AVAILABLE_YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year)
                          setYearDropdownOpen(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                          year === selectedYear ? "font-semibold text-primary" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          >
            {summaryLoading ? (
              <Skeleton className="h-[90px] w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ) : (
              <PaymentsBarChart data={summary?.monthlyData ?? []} />
            )}
          </InsetCard>
        </div>

        {/* ── All Payments Table ────────────────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">All payments</h4>
            <PaymentsFilterPopover value={filters} onChange={handleFiltersChange} />
          </div>

          {!listLoading && payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-[72px] rounded-2xl bg-[#F2F2F7] dark:bg-gray-800 flex items-center justify-center">
                <Icon name="creditCard" size={36} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-[16px] font-semibold text-gray-900 dark:text-white">No payments</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">No payments has been processed yet</p>
            </div>
          ) : (
            <PaymentsTable

              payments={payments}
              isLoading={listLoading}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onView={setSelectedPayment}
            />
          )}
        </div>
      </div>

      <PaymentDetailDialog
        payment={selectedPayment}
        open={!!selectedPayment}
        onOpenChange={(o) => {
          if (!o) setSelectedPayment(null)
        }}
      />
    </div>
  )
}
