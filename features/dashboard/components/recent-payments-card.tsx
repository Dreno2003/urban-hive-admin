"use client"

import React, { useState } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Pagination } from "@/shared/components/ui/pagination"
import { useRecentPayments } from "../hooks/use-recent-payments"
import { cn } from "@/shared/lib/utils"
import { type PaymentStatus } from "../types"

export interface RecentPaymentsCardProps {
  className?: string
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  paid: {
    label: "Paid",
    dot: "bg-green-500",
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-700 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    dot: "bg-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    dot: "bg-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
  },
}

const COL_WIDTHS = [
  "w-[18%]", // Name
  "w-[18%]", // Space
  "w-[14%]", // Space type
  "w-[18%]", // Amount
  "w-[20%]", // Date
  "w-[12%]", // Status
]

export function RecentPaymentsCard({ className }: RecentPaymentsCardProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useRecentPayments(page)

  const payments = data?.payments ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px] p-1.5 transition-all duration-200 shadow-sm",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-4">
        <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight font-sans">
          All payments
        </h4>
        <button className="bg-[#F1F1F6] hover:bg-[#E8E8EE] dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[13px] font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200 cursor-pointer active:scale-95">
          <span>See all payments</span>
          <Icon
            name="chevronRight"
            size={13}
            className="text-gray-500 dark:text-gray-400 mt-0.5"
          />
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "bg-[#F8F9FC] dark:bg-gray-900/50 rounded-[22px] overflow-hidden transition-opacity duration-300",
          isFetching && !isLoading ? "opacity-60" : "opacity-100"
        )}
      >
        {/* Column headers */}
        <div className="flex items-center px-6 py-3.5 border-b border-gray-100 dark:border-gray-800/60">
          {["Name", "Space", "Space type", "Amount", "Date", "Payment status"].map(
            (col, i) => (
              <span
                key={col}
                className={cn(
                  "text-[12.5px] font-semibold text-gray-500 dark:text-gray-400 font-sans uppercase tracking-wide",
                  COL_WIDTHS[i],
                  i === 5 && "text-right"
                )}
              >
                {col}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800/40">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center px-6 py-5 gap-2 animate-pulse"
              >
                <Skeleton className="h-4 w-[16%] mr-[2%] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[16%] mr-[2%] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[12%] mr-[2%] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[16%] mr-[2%] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[18%] mr-[2%] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800 ml-auto" />
              </div>
            ))
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium font-sans">
              No payments found.
            </div>
          ) : (
            payments.map((payment, idx) => {
              const status = STATUS_CONFIG[payment.status]
              return (
                <div
                  key={payment.id}
                  className={cn(
                    "flex items-center px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150 cursor-pointer group",
                    idx === payments.length - 1 && "rounded-b-[22px]"
                  )}
                >
                  {/* Name */}
                  <span
                    className={cn(
                      "text-[14px] font-medium text-gray-900 dark:text-gray-100 font-sans truncate pr-3",
                      COL_WIDTHS[0]
                    )}
                  >
                    {payment.clientName}
                  </span>

                  {/* Space */}
                  <span
                    className={cn(
                      "text-[13.5px] text-gray-500 dark:text-gray-400 font-sans truncate pr-3",
                      COL_WIDTHS[1]
                    )}
                  >
                    {payment.space}
                  </span>

                  {/* Space type */}
                  <span
                    className={cn(
                      "text-[13.5px] text-gray-500 dark:text-gray-400 font-sans truncate pr-3",
                      COL_WIDTHS[2]
                    )}
                  >
                    {payment.spaceType}
                  </span>

                  {/* Amount */}
                  <span
                    className={cn(
                      "text-[13.5px] font-semibold text-gray-900 dark:text-gray-100 font-sans truncate pr-3",
                      COL_WIDTHS[3]
                    )}
                  >
                    {payment.amount}
                  </span>

                  {/* Date */}
                  <span
                    className={cn(
                      "text-[13.5px] text-gray-500 dark:text-gray-400 font-sans truncate pr-3",
                      COL_WIDTHS[4]
                    )}
                  >
                    {payment.dateRange}
                  </span>

                  {/* Status badge */}
                  <div className={cn("flex justify-end", COL_WIDTHS[5])}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-sans",
                        status.bg,
                        status.text
                      )}
                    >
                      <span
                        className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)}
                      />
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────── */}
        {!isLoading && totalPages > 1 && (
          <div className="px-5 pb-3">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              variant="compact"
            />
          </div>
        )}
      </div>
    </div>
  )
}
