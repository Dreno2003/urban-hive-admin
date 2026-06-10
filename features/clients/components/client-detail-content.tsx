"use client"

import React, { useState } from "react"
import { useClientDetail } from "../hooks/use-clients"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Separator } from "@/shared/components/ui/separator"
import { Pagination } from "@/shared/components/ui/pagination"
import { cn } from "@/shared/lib/utils"
import type { ClientBookingHistory } from "../types"
import { Badge } from "@/shared/components/ui/badge"

const COLS    = ["ID", "Space", "Space type", "Check in", "Check out", "Amount", "Payment", "Action"]
const WIDTHS  = ["w-[8%]", "w-[14%]", "w-[10%]", "w-[12%]", "w-[12%]", "w-[11%]", "w-[12%]", "w-[8%]"]

const PAYMENT_STYLES: Record<string, string> = {
  paid:      "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-500",
  failed:    "bg-red-100 text-red-600",
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function ClientDetailContent({ id }: { id: string }) {
  const [bookingPage, setBookingPage] = useState(1)
  const { data: client, isLoading } = useClientDetail(id, bookingPage)

  return (
    <div className="flex-1 bg-white flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* Breadcrumb */}
        {/* <nav className="flex items-center gap-1.5 text-sm mb-6">
          <Link href="/dashboard/clients" className="text-gray-400 hover:text-gray-600 transition-colors">
            Clients
          </Link>
          <ChevronRight className="size-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">Client details</span>
        </nav> */}

        {/* Client profile card */}
        <div className="bg-white border  rounded-[24px] px-6 py-5 mb-5">
          {/* Top row: avatar + name + actions */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="size-[64px] rounded-full bg-gray-200" />
              ) : (
                <div className="size-[64px] rounded-full bg-[#6C5CE7] flex items-center justify-center shrink-0">
                  <span className="text-white text-[22px] font-bold">{getInitials(client?.name ?? "")}</span>
                </div>
              )}
              <div>
                <p className="text-[13px] text-gray-400 mb-0.5">Client name</p>
                {isLoading
                  ? <Skeleton className="h-6 w-40 bg-gray-200" />
                  : <p className="text-[20px] font-bold text-gray-900">{client?.name}</p>
                }
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary-outline" className="h-[38px] px-5 rounded-full text-[13px]">
                Suspend client
              </Button>
              <Button className="h-[38px] px-5 rounded-full text-[13px] bg-[#FFF0F0] text-red-500 hover:bg-red-50 border border-red-100">
                Remove client
              </Button>
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Info row */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Client ID</p>
              {isLoading
                ? <Skeleton className="h-5 w-16 bg-gray-200" />
                : <p className="text-[16px] font-bold text-gray-900">{client?.id}</p>
              }
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Status</p>
              {isLoading
                ? <Skeleton className="h-5 w-16 bg-gray-200" />
                : (

                  <div>
                    <Badge variant={'success-outline'} iconSize={100} iconName="circle" className="size-" >{client?.status}</Badge>
                  </div>
                  // <span className="inline-flex items-center gap-1.5">
                  //   <span className={cn("size-2 rounded-full", client?.status === "active" ? "bg-green-500" : "bg-gray-400")} />
                  //   <span className="text-[14px] font-medium text-gray-900 capitalize">{client?.status}</span>
                  // </span>
                )
              }
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Client phone number</p>
              {isLoading
                ? <Skeleton className="h-5 w-36 bg-gray-200" />
                : <p className="text-[14px] font-medium text-gray-900">{client?.phone}</p>
              }
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Client email</p>
              {isLoading
                ? <Skeleton className="h-5 w-44 bg-gray-200" />
                : <p className="text-[14px] font-medium text-gray-900">{client?.email}</p>
              }
            </div>
          </div>
        </div>

        {/* Booking history table */}
        <div className="bg-white border  rounded-[24px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight">Booking history</h4>
            <Button variant="secondary-outline" size="sm" className="rounded-full h-[34px] px-4 gap-2 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filter
            </Button>
          </div>

          {/* Column headers */}
          <div className="flex items-center bg-secondary px-6 py-3.5 border-y border-gray-100">
            {COLS.map((col, i) => (
              <span key={col} className={cn("text-[12.5px] font-semibold tracking-wide", WIDTHS[i])}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-4 gap-2 animate-pulse">
                  {WIDTHS.map((w, j) => <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />)}
                </div>
              ))
            ) : !client?.bookingHistory?.length ? (
              <div className="py-16 text-center text-sm text-gray-400">No booking history</div>
            ) : (
              client.bookingHistory.map((b: ClientBookingHistory, idx: number) => (
                <div
                  key={b.id}
                  className={cn(
                    "flex items-center px-6 py-4 hover:bg-gray-50 transition-colors",
                    idx === (client.bookingHistory?.length ?? 0) - 1 && "rounded-b-[24px]"
                  )}
                >
                  <span className={cn("text-[13px] text-gray-600 font-mono", WIDTHS[0])}>{b.id}</span>
                  <span className={cn("text-[13px] text-gray-700 truncate pr-3", WIDTHS[1])}>{b.space}</span>
                  <span className={cn("text-[13px] text-gray-500", WIDTHS[2])}>{b.spaceType}</span>
                  <span className={cn("text-[13px] text-gray-600", WIDTHS[3])}>{b.checkIn}</span>
                  <span className={cn("text-[13px] text-gray-600", WIDTHS[4])}>{b.checkOut}</span>
                  <span className={cn("text-[13px] font-medium text-gray-800", WIDTHS[5])}>{b.amount}</span>
                  <div className={WIDTHS[6]}>
                    <Badge variant={'success'} >
                      
                      {b.paymentStatus.charAt(0).toUpperCase() + b.paymentStatus.slice(1)}
                    </Badge>
                    {/* <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium",
                      PAYMENT_STYLES[b.paymentStatus] ?? "bg-gray-100 text-gray-500"
                    )}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {b.paymentStatus.charAt(0).toUpperCase() + b.paymentStatus.slice(1)}
                    </span> */}
                  </div>
                  <span className={cn("text-[13px] text-primary font-medium hover:underline cursor-pointer", WIDTHS[7])}>View</span>
                </div>
              ))
            )}
          </div>

          <Separator />
          {!isLoading && (client?.bookingHistoryTotalPages ?? 1) > 1 && (
            <div className="px-6 pb-2">
              <Pagination
                currentPage={bookingPage}
                totalPages={client?.bookingHistoryTotalPages ?? 1}
                onPageChange={setBookingPage}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
