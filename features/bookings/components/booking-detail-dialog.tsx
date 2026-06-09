"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Copy } from "lucide-react"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import type { Booking, BookingPaymentStatus } from "../types"

const PAYMENT_STYLE: Record<BookingPaymentStatus, { dot: string; text: string; bg: string; label: string }> = {
  paid:      { dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-100",  label: "Paid" },
  pending:   { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" },
  cancelled: { dot: "bg-red-400",    text: "text-red-500",    bg: "bg-red-100",    label: "Refunded" },
  failed:    { dot: "bg-red-500",    text: "text-red-700",    bg: "bg-red-100",    label: "Failed" },
}

function Field({ label, children, fullWidth }: { label: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "col-span-2")}>
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{children}</div>
    </div>
  )
}

interface BookingDetailDialogProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancelRequest: () => void
}

export function BookingDetailDialog({ booking, open, onOpenChange, onCancelRequest }: BookingDetailDialogProps) {
  if (!booking) return null

  const isCancelled = booking.paymentStatus === "cancelled"
  const { dot, text, bg, label } = PAYMENT_STYLE[booking.paymentStatus]

  return (
    <DialogContainer
      dialogTitle={
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">Booking details</span>
          {isCancelled && (
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
              <Icon name="x" size={10} />
              Cancelled
            </span>
          )}
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
      className="!px-2 pb-2"
    >
      <div className="flex flex-col gap-0 mt-2">
        {/* Row 1 — Client name + Space */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Client name">
            <span className="flex items-center gap-1.5">{booking.clientName}
              <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
            </span>
          </Field>
          <Field label="Space">
            <span className="flex items-center gap-1.5">{booking.space ?? booking.spaceType}
              <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 2 — Phone + Email */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Client phone number">
            <span className="flex items-center gap-1.5">{booking.clientPhone ?? "—"}
              <button onClick={() => navigator.clipboard.writeText(booking.clientPhone ?? "")} className="text-gray-400 hover:text-gray-600">
                <Copy className="size-3.5" />
              </button>
            </span>
          </Field>
          <Field label="Client email">
            <span className="flex items-center gap-1.5 break-all">{booking.clientEmail ?? "—"}
              <button onClick={() => navigator.clipboard.writeText(booking.clientEmail ?? "")} className="text-gray-400 hover:text-gray-600 shrink-0">
                <Copy className="size-3.5" />
              </button>
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 3 — Check in + Check out */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Check in">{booking.checkIn}</Field>
          <Field label="Check out">{booking.checkOut}</Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 4 — Duration + Amount paid */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Duration">{booking.duration ?? "—"}</Field>
          <Field label="Amount paid">
            <span className="flex items-center gap-2">
              {booking.amount}
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", bg, text)}>
                <span className={cn("size-1.5 rounded-full shrink-0", dot)} />
                {label}
              </span>
            </span>
          </Field>
        </div>

        {/* Cancelled-only rows */}
        {isCancelled && booking.cancelledBy && (
          <>
            <Separator className="bg-gray-100" />
            <div className="grid grid-cols-2 gap-4 py-4">
              <Field label="Cancelled by">
                <span className="flex items-center gap-1.5">{booking.cancelledBy}
                  <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
                </span>
              </Field>
            </div>
          </>
        )}

        {isCancelled && booking.cancellationReason && (
          <>
            <Separator className="bg-gray-100" />
            <div className="py-4">
              <Field label="Reason for cancellation" fullWidth>
                {booking.cancellationReason}
              </Field>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {isCancelled ? (
        <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90 mt-2">
          Close
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button variant="secondary-outline" className="h-11 rounded-full text-[14px]">Download invoice</Button>
          <Button onClick={onCancelRequest} className="h-11 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90">Cancel booking</Button>
        </div>
      )}
    </DialogContainer>
  )
}
