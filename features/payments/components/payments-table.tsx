"use client"

import React from "react"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Pagination } from "@/shared/components/ui/pagination"
import { Separator } from "@/shared/components/ui/separator"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import type { Payment, PaymentStatus } from "../types"
import { Icon } from "@/shared/components/ui/icon"

const COLS = ["ID", "Name", "Amount", "Space", "Space type", "Date", "Payment status", "Action"]
const WIDTHS = [
  "w-[8%]",
  "w-[18%]",
  "w-[12%]",
  "w-[16%]",
  "w-[12%]",
  "w-[14%]",
  "w-[12%]",
  "w-[8%]"
]

const STATUS_MAP: Record<PaymentStatus, { variant: "success" | "warning" | "destructive" | "secondary"; icon: "check" | "loader" | "x"; label: string }> = {
  paid: { variant: "success", icon: "check", label: "Paid" },
  pending: { variant: "warning", icon: "loader", label: "Pending" },
  failed: { variant: "destructive", icon: "x", label: "Failed" },
  refunded: { variant: "secondary", icon: "loader", label: "Refunded" },
}

interface PaymentsTableProps {
  payments: Payment[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onView?: (payment: Payment) => void
}

export function PaymentsTable({
  payments,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
}: PaymentsTableProps) {
  return (
    <>
      {/* Column headers */}
      <div className="flex items-center bg-[#F8F9FA] dark:bg-gray-900 px-6 py-3.5 border-y border-gray-100 dark:border-gray-800">
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
              {WIDTHS.map((w, j) => (
                <Skeleton key={j} className={cn("h-4 bg-gray-100 dark:bg-gray-800", w)} />
              ))}
            </div>
          ))
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-1.5">
            <Icon name='creditCard2' className="size-[80px] text-secondary-foreground"  />
            <p className="text-body-base font-bold  dark:text-white">No payments</p>
            <p className="text-sm text-secondary-foreground dark:text-gray-500">No payments has been processed yet</p>
          </div>
        ) : (
          payments.map((p, idx) => {
            const { variant, icon, label } = STATUS_MAP[p.paymentStatus]
            return (
              <div
                key={p.id}
                onClick={() => onView?.(p)}
                className={cn(
                  "flex items-center px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer",
                  idx === payments.length - 1 && "rounded-b-[28px]"
                )}
              >
                <span className={cn("text-[13px] text-gray-500 font-mono", WIDTHS[0])}>{p.id}</span>
                <span className={cn("text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate pr-3", WIDTHS[1])}>
                  {p.clientName}
                </span>
                <span className={cn("text-[13px] text-gray-800 dark:text-gray-200 font-medium", WIDTHS[2])}>
                  {p.amount}
                </span>
                <span className={cn("text-[13px] text-gray-500 truncate pr-3", WIDTHS[3])}>
                  {p.spaceName}
                </span>
                <span className={cn("text-[13px] text-gray-500", WIDTHS[4])}>
                  <span className="inline-block border border-gray-200 dark:border-gray-800 rounded-md px-1.5 py-0.5 text-[12px]">
                    {p.spaceType}
                  </span>
                </span>
                <span className={cn("text-[13px] text-gray-500", WIDTHS[5])}>{p.billingPeriod}</span>
                <div className={cn(WIDTHS[6])}>
                  <Badge variant={variant} iconName={icon}>
                    {label}
                  </Badge>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.(p)
                  }}
                  className={cn("text-[13px] text-primary font-medium cursor-pointer hover:underline", WIDTHS[7])}
                >
                  View details
                </span>
              </div>
            )
          })
        )}
      </div>

      <Separator />
      {totalPages > 1 && (
        <div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-950 rounded-b-[28px]">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  )
}
