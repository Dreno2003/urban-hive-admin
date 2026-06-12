"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/components/ui/badge"
import type { Payment, PaymentStatus } from "../types"

const STATUS_MAP: Record<PaymentStatus, { variant: "success" | "warning" | "destructive" | "secondary"; icon: "check" | "loader" | "x" | "circle"; label: string }> = {
  paid:     { variant: "success",     icon: "check",  label: "Paid" },
  pending:  { variant: "warning",     icon: "loader", label: "Pending" },
  failed:   { variant: "destructive", icon: "x",      label: "Failed" },
  refunded: { variant: "secondary",   icon: "loader", label: "Refunded" },
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium tracking-tight leading-none">{label}</span>
      <div className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 flex items-center leading-tight">
        {children}
      </div>
    </div>
  )
}

interface PaymentDetailDialogProps {
  payment: Payment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDetailDialog({ payment, open, onOpenChange }: PaymentDetailDialogProps) {
  if (!payment) return null

  const { variant, icon, label } = STATUS_MAP[payment.paymentStatus]

  return (
    <DialogContainer
      dialogTitle="Payment details"
      open={open}
      onOpenChange={onOpenChange}
      className="pb-4"
    >
      <div className="flex flex-col gap-0 mt-2">
        {/* Row 1 — Payment ID & Payment Date */}
        <div className="grid grid-cols-2 gap-6 py-5">
          <Field label="Payment ID">
            {payment.id}
          </Field>
          <Field label="Payment Date">
            {payment.datePaid ?? "—"}
          </Field>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Row 2 — Client name & Space */}
        <div className="grid grid-cols-2 gap-6 py-5">
          <Field label="Client name">
            <span className="underline decoration-1 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
              {payment.clientName}
            </span>
            <Icon name="exportSquareOutline" className="size-4 text-gray-400 shrink-0 ml-1.5" />
          </Field>
          <Field label="Space">
            <span className="underline decoration-1 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
              {payment.spaceName}
            </span>
            <Icon name="exportSquareOutline" className="size-4 text-gray-400 shrink-0 ml-1.5" />
          </Field>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Row 3 — Duration & Amount paid */}
        <div className="grid grid-cols-2 gap-6 py-5">
          <Field label="Duration">
            {payment.duration ?? "—"}
          </Field>
          <Field label="Amount paid">
            <span>{payment.amount}</span>
            <Badge
              variant={variant}
              iconName={icon}
              iconSize={12}
              className="ml-2 !py-0 h-[24px] flex items-center justify-center px-2.5 rounded-full border-0 text-xs font-semibold"
            >
              {label}
            </Badge>
          </Field>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Row 4 — Payment method & Cancellation period */}
        <div className="grid grid-cols-2 gap-6 py-5">
          <Field label="Payment method">
            {payment.paymentMethod ?? "—"}
          </Field>
          <Field label="Cancellation period">
            <span>{payment.cancellationPeriod ?? "—"}</span>
            {payment.cancellationTimeLeft && payment.cancellationTimeLeft !== "—" && (
              <Badge
                variant="warning"
                iconName="clock"
                iconSize={12}
                className="ml-2 !py-0 h-[24px] flex items-center justify-center px-2.5 rounded-full border-0 text-xs font-semibold"
              >
                {payment.cancellationTimeLeft}
              </Badge>
            )}
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button
          variant="secondary"
          className="h-[48px] rounded-full text-base font-semibold"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
        <Button
          className="h-[48px] rounded-full text-base font-semibold bg-primary text-white hover:bg-primary/90"
          onClick={() => alert("Downloading invoice...")}
        >
          Download invoice
        </Button>
      </div>
    </DialogContainer>
  )
}

