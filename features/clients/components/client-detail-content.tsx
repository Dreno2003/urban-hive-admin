"use client"

import React, { useState } from "react"
import { useClientDetail } from "../hooks/use-clients"
import { BookingsTable } from "@/features/bookings/components/bookings-table"
import { BookingDetailDialog } from "@/features/bookings/components/booking-detail-dialog"
import { CancelBookingDialog } from "@/features/bookings/components/cancel-booking-dialog"
import { RemoveClientDialog } from "./remove-client-dialog"
import { BookingsFilterPopover, type BookingFilters } from "@/features/bookings/components/bookings-filter-popover"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Separator } from "@/shared/components/ui/separator"
import { Badge } from "@/shared/components/ui/badge"
import type { Booking } from "@/features/bookings/types"
import type { ClientBookingHistory } from "../types"

const EMPTY_FILTERS: BookingFilters = { statuses: [], spaceTypes: [], dateFrom: "", dateTo: "" }

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function toBooking(b: ClientBookingHistory, clientName: string): Booking {
  return {
    id: b.id,
    clientName,
    space: b.space,
    spaceType: b.spaceType,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    amount: b.amount,
    paymentStatus: b.paymentStatus,
  }
}

export function ClientDetailContent({ id }: { id: string }) {
  const [bookingPage, setBookingPage] = useState(1)
  const [filters, setFilters] = useState<BookingFilters>(EMPTY_FILTERS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const { data: client, isLoading } = useClientDetail(id, bookingPage, filters)

  const handleFiltersChange = (f: BookingFilters) => { setFilters(f); setBookingPage(1) }

  const bookings: Booking[] = (client?.bookingHistory ?? []).map((b) =>
    toBooking(b, client?.name ?? "")
  )

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* Client profile card */}
        <div className="bg-white border border-gray-100 rounded-[24px] px-6 py-5 mb-5">
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
                <p className="text-[13px] text-secondary-foreground mb-0.5">Client name</p>
                {isLoading
                  ? <Skeleton className="h-6 w-40 bg-gray-200" />
                  : <p className="text-[20px] font-bold">{client?.name}</p>
                }
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary-outline" className="h-[38px] px-5 rounded-full text-[13px]">
                Suspend client
              </Button>
              <Button className="h-[38px] px-5 rounded-full text-[13px] bg-[#FFF0F0] text-red-500 hover:bg-red-50 border border-red-100" onClick={() => setRemoveOpen(true)}>
                Remove client
              </Button>
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Info row */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Client ID</p>
              {isLoading
                ? <Skeleton className="h-5 w-16 bg-gray-200" />
                : <p className="text-[16px] font-bold">{client?.id}</p>
              }
            </div>
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Status</p>
              {isLoading
                ? <Skeleton className="h-5 w-16 bg-gray-200" />
                : <Badge variant="success-outline" iconName="circle" iconClassName="!size-2.5" className="!py-3">{client?.status}</Badge>
              }
            </div>
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Client phone number</p>
              {isLoading
                ? <Skeleton className="h-5 w-36 bg-gray-200" />
                : <p className="text-[14px] font-medium">{client?.phone}</p>
              }
            </div>
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Client email</p>
              {isLoading
                ? <Skeleton className="h-5 w-44 bg-gray-200" />
                : <p className="text-[14px] font-medium">{client?.email}</p>
              }
            </div>
          </div>
        </div>

        {/* Booking history */}
        <div className="bg-white border border-gray-100 rounded-[24px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold tracking-tight">Booking history</h4>
            <BookingsFilterPopover value={filters} onChange={handleFiltersChange} />
          </div>

          <BookingsTable
            bookings={bookings}
            isLoading={isLoading}
            currentPage={bookingPage}
            totalPages={client?.bookingHistoryTotalPages ?? 1}
            onPageChange={setBookingPage}
            onView={setSelectedBooking}
          />
        </div>

      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(o) => { if (!o) setSelectedBooking(null) }}
        onCancelRequest={() => { setSelectedBooking(null); setCancelOpen(true) }}
      />

      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={async () => setCancelOpen(false)}
      />

      <RemoveClientDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        clientName={client?.name ?? ""}
        onConfirm={() => {}}
      />
    </div>
  )
}
