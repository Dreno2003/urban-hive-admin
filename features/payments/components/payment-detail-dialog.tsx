"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Copy } from "lucide-react"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/components/ui/badge"
import type { Payment, PaymentStatus } from "../types"

const STATUS_MAP: Record<PaymentStatus, { variant: "success" | "warning" | "destructive" | "secondary"; icon: "check" | "loader" | "x"; label: string }> = {
  paid:     { variant: "success",     icon: "check",  label: "Paid" },
  pending:  { variant: "warning",     icon: "loader", label: "Pending" },
  failed:   { variant: "destructive", icon: "x",      label: "Failed" },
  refunded: { variant: "secondary",   icon: "loader", label: "Refunded" },
}

function Field({ label, children, fullWidth }: { label: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "col-span-2")}>
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{children}</div>
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

  const copyToClipboard = (txt?: string) => {
    if (txt) {
      navigator.clipboard.writeText(txt)
    }
  }

  return (
    <DialogContainer
      dialogTitle={
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">Payment details</span>
          <Badge variant={variant} iconName={icon}>
            {label}
          </Badge>
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
      className="!px-2 pb-2"
    >
      <div className="flex flex-col gap-0 mt-2">
        {/* Row 1 — Transaction ID + Reference */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Payment ID">
            <span className="font-mono text-gray-500">{payment.id}</span>
          </Field>
          <Field label="Transaction Reference">
            <span className="flex items-center gap-1.5 font-mono text-[13px]">
              {payment.transactionRef ?? "—"}
              {payment.transactionRef && (
                <button
                  onClick={() => copyToClipboard(payment.transactionRef)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy className="size-3.5" />
                </button>
              )}
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 2 — Client details */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Client name">
            <span className="flex items-center gap-1.5">
              {payment.clientName}
              <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
            </span>
          </Field>
          <Field label="Client email">
            <span className="flex items-center gap-1.5 break-all">
              {payment.clientEmail ?? "—"}
              {payment.clientEmail && (
                <button
                  onClick={() => copyToClipboard(payment.clientEmail)}
                  className="text-gray-400 hover:text-gray-600 shrink-0 transition-colors"
                >
                  <Copy className="size-3.5" />
                </button>
              )}
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 3 — Space + Space Type */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Space name">
            <span className="flex items-center gap-1.5">
              {payment.spaceName}
              <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
            </span>
          </Field>
          <Field label="Space type">
            <span className="inline-block border border-gray-200 rounded-md px-1.5 py-0.5 text-[12px] w-fit">
              {payment.spaceType}
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 4 — Billing Period & Method */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Billing interval / Period">{payment.billingPeriod}</Field>
          <Field label="Payment method">{payment.paymentMethod ?? "—"}</Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 5 — Amount & Date Paid */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Amount Paid">
            <span className="text-[16px] font-bold text-gray-900 dark:text-white">{payment.amount}</span>
          </Field>
          <Field label="Date Paid">{payment.datePaid ?? "—"}</Field>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          variant="secondary-outline"
          className="h-11 rounded-full text-[14px]"
          onClick={() => alert("Downloading receipt...")}
        >
          Download receipt
        </Button>
        <Button
          onClick={() => onOpenChange(false)}
          className="h-11 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90"
        >
          Close
        </Button>
      </div>
    </DialogContainer>
  )
}
