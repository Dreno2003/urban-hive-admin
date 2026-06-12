"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

interface ConfirmBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmBookingDialog({
  open,
  onOpenChange,
  clientName,
  onConfirm,
  onCancel,
}: ConfirmBookingDialogProps) {
  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle={
        <span className="text-[26px] font-semibold text-[#1F2937] dark:text-white tracking-tight">
          Book space
        </span>
      }
      isShowTopSeparator
      contentClassName="sm:max-w-[500px] rounded-[28px] md:!rounded-[32px] px-0"
      className="pb-2"
    >
      {/* Client Name section */}
      <div className="mt-4 flex flex-col gap-1.5">
        <span className="text-[14px] text-secondary-foreground font-semibold tracking-wide">
          Client name
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[18px]  dark:text-white hover:underline underline-offset-4 cursor-pointer"
            onClick={() => toast.info("Viewing client details")}
          >
            {clientName || "Adaeze Okonwo"}
          </span>
          <button
            onClick={() => toast.info("Opening client profile")}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-0 bg-transparent border-none flex items-center justify-center"
          >
            <Icon name="exportSquareOutline" size={16} />
          </button>
        </div>
      </div>

      <Separator className="my-5 " />

      {/* Booking Details Grid */}
      <div className="flex gap-4">
        {/* Booking Duration */}
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[14px] text-secondary-foreground  tracking-wide">
            Booking duration
          </span>
          <button
            type="button"
            onClick={() => toast.info("Opening date picker...")}
            className="w-full text-left py-3 px-5 rounded-full border-none bg-[#F2F2F7] dark:bg-gray-800 text-[15px] text-gray-400 focus:outline-none cursor-pointer"
          >
            Add dates
          </button>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[14px] text-secondary-foreground  tracking-wide">
            Duration
          </span>
          <Input
            value="Daily"
            readOnly
            className="w-full text-left py-3 px-5 rounded-full dark:bg-gray-800 text-[15px] text-[#1F2937] dark:text-gray-200 focus:outline-none cursor-pointer"
          />

        </div>
      </div>

      <Separator className="my-5 " />

      {/* Pricing display */}
      <div className="flex justify-between items-center my-6">
        <span className="text-[15px] text-secondary-foreground font-medium">
          NGN 35,000 x 3 nights
        </span>
        <span className="text-[22px] font-bold text-[#1F2937] dark:text-white tracking-tight">
          NGN 280,000
        </span>
      </div>

      {/* Actions */}
      <Separator className="my-5 " />

      <div className="flex gap-3 ">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 rounded-full bg-[#F2F2F7] dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-[15px] hover:bg-[#E5E5EA] transition-colors cursor-pointer border-none"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-semibold text-[15px] hover:bg-primary/95 transition-colors cursor-pointer border-none"
        >
          Confirm booking
        </Button>
      </div>
    </DialogContainer>
  )
}
