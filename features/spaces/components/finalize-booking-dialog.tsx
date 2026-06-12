"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { toast } from "sonner"

interface FinalizeBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  clientId?: string
  spaceName?: string
  spaceRate?: string
  spaceLocation?: string
  spaceImage?: string
  checkIn?: string
  checkOut?: string
  duration?: string
  amount?: string
  rateDetail?: string
  onConfirm: () => void
  onCancel: () => void
}

export function FinalizeBookingDialog({
  open,
  onOpenChange,
  clientName,
  clientId = "00001",
  spaceName = "Executive Studio — Wuse 2",
  spaceRate = "₦35,000",
  spaceLocation = "Wuse 2 Abuja",
  spaceImage = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=60",
  checkIn = "May 12, 2026",
  checkOut = "May 20, 2026",
  duration = "8 days",
  amount = "₦280,000",
  rateDetail = "NGN 35,000 x 8 nights",
  onConfirm,
  onCancel,
}: FinalizeBookingDialogProps) {
  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle={
        <span className="text-[26px] font-semibold text-[#1F2937] dark:text-white tracking-tight">
          Confirm booking
        </span>
      }
      isShowTopSeparator
      contentClassName="sm:max-w-[550px] rounded-[28px] md:!rounded-[32px] px-0"
      className="pb-2"
    >
      {/* Space Preview Card */}
      <div className="mt-4 flex gap-4 items-center">
        <img
          src={spaceImage}
          alt={spaceName}
          className="w-[120px] h-[74px] object-cover rounded-xl"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-medium  dark:text-white leading-snug">
            {spaceName}
          </span>
          <div className="text-body-lg font-normal leading-snug">
            <span className="font-bold text-[#1C1C1E] dark:text-white">{spaceRate}</span>
            <span className="text-secondary-foreground">/day</span>
          </div>
          <span className="text-body-sm text-secondary-foreground font-normal leading-snug">
            {spaceLocation}
          </span>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Details list */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Client details */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Client name
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-body-lg  dark:text-white font-medium hover:underline underline-offset-4 cursor-pointer"
                onClick={() => toast.info("Viewing client details")}
              >
                {clientName || "Adaeze Okonkwo"}
              </span>
              <button
                onClick={() => toast.info("Opening client profile")}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0 bg-transparent border-none flex items-center justify-center"
              >
                <Icon name="exportSquareOutline" size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Client ID
            </span>
            <span className="text-body-lg text dark:text-white font-medium">
              {clientId}
            </span>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Row 2: Check-in / Check-out */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Check in
            </span>
            <span className="text-body-lg dark:text-white font-medium">
              {checkIn}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Check out
            </span>
            <span className="text-body-lg dark:text-white font-medium">
              {checkOut}
            </span>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Row 3: Duration / Amount */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Duration
            </span>
            <span className="text-body-lg dark:text-white font-medium">
              {duration}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-body-sm text-secondary-foreground tracking-wide font-normal">
              Amount
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-bold dark:text-white tracking-tight">
                  {amount}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F2F2F7] dark:bg-gray-800 text-[12px] font-medium text-secondary-foreground dark:text-gray-300">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block shrink-0"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Awaiting payment
                </span>
              </div>
              <span className="text-body-sm text-secondary-foreground font-normal">
                {rateDetail}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          id="cancel-finalize-booking-btn"
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 rounded-full bg-[#F2F2F7] dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-[15px] hover:bg-[#E5E5EA] transition-colors cursor-pointer border-none"
        >
          Cancel
        </Button>
        <Button
          id="create-booking-send-invoice-btn"
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-semibold text-[15px] hover:bg-primary/95 transition-colors cursor-pointer border-none"
        >
          Create booking & send invoice
        </Button>
      </div>
    </DialogContainer>
  )
}
