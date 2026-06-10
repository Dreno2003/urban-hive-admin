"use client"

import React from "react"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Pagination } from "@/shared/components/ui/pagination"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/shared/lib/utils"
import type { Booking, BookingPaymentStatus } from "../types"

const COLS = ["ID", "Client", "Space type", "Check in", "Check out", "Amount", "Payment", "Action"]
const WIDTHS = ["w-[8%]", "w-[18%]", "w-[12%]", "w-[13%]", "w-[13%]", "w-[12%]", "w-[14%]", "w-[10%]"]

const PAYMENT_STYLE: Record<BookingPaymentStatus, { dot: string; text: string; bg: string; label: string }> = {
  paid:      { dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-100",  label: "Paid" },
  pending:   { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" },
  cancelled: { dot: "bg-red-500",    text: "text-red-700",    bg: "bg-red-100",    label: "Cancelled" },
  failed:    { dot: "bg-red-500",    text: "text-red-700",    bg: "bg-red-100",    label: "Failed" },
}

interface BookingsTableProps {
  bookings: Booking[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onView?: (booking: Booking) => void
}

export function BookingsTable({ bookings, isLoading, currentPage, totalPages, onPageChange, onView }: BookingsTableProps) {
  return (
    <>
      {/* Column headers */}
      <div className="flex items-center bg-secondary px-6 py-3.5 border-y border-gray-100 dark:border-gray-800">
        {COLS.map((col, i) => (
          <span key={col} className={cn("text-[12.5px] font-semibold text-gray-500 tracking-wide", WIDTHS[i])}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-gray-50 dark:divide-gray-800/40">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center px-6 py-5 gap-2 animate-pulse">
              {WIDTHS.map((w, j) => <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />)}
            </div>
          ))
        ) : (
          bookings.map((b, idx) => {
            const { dot, text, bg, label } = PAYMENT_STYLE[b.paymentStatus]
            return (
              <div
                key={b.id}
                className={cn(
                  "flex items-center px-6 py-5 hover:sbg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer",
                  idx === bookings.length - 1 && "rounded-b-[28px]"
                )}
              >
                <span className={cn("text-[13px] text-gray-500 font-mono", WIDTHS[0])}>{b.id}</span>
                <span className={cn("text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate pr-3", WIDTHS[1])}>{b.clientName}</span>
                <span className={cn("text-[13px] text-gray-500", WIDTHS[2])}>
                  <span className="inline-block border border-gray-200 rounded-md px-1.5 py-0.5 text-[12px]">{b.spaceType}</span>
                </span>
                <span className={cn("text-[13px] text-gray-500", WIDTHS[3])}>{b.checkIn}</span>
                <span className={cn("text-[13px] text-gray-500", WIDTHS[4])}>{b.checkOut}</span>
                <span className={cn("text-[13px] text-gray-800 dark:text-gray-200 font-medium", WIDTHS[5])}>{b.amount}</span>
                <div className={cn(WIDTHS[6])}>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium", bg, text)}>
                    <span className={cn("size-2 rounded-full shrink-0", dot)} />
                    {label}
                  </span>
                </div>
                <span onClick={() => onView?.(b)} className={cn("text-[13px] text-primary font-medium cursor-pointer hover:underline", WIDTHS[7])}>View</span>
              </div>
            )
          })
        )}
      </div>

      <Separator />
      {totalPages > 1 && (
        <div className="px-6 pb-2">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  )
}
