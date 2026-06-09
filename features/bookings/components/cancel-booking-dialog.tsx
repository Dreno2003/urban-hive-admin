"use client"

import * as React from "react"
import { DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import type { Dictionary } from "@/i18n/get-dictionary"
import { Separator } from "@/shared/components/ui/separator"

export interface CancelBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dict: Dictionary
  bookingId?: string
  className?: string
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  dict,
  bookingId,
  className,
}: CancelBookingDialogProps) {
  const settingsDict = (dict as any).settings || {}
  const [isPending, setIsPending] = React.useState(false)

  const handleCancel = () => {
    // TODO: implement cancel booking mutation
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <DialogContainer open={open} onOpenChange={onOpenChange} className={cn('!p-6', className)}>
      <div className="flex flex-col items-center text-center">
        {/* Icon at top */}

        <div className="flex items-center justify-center bg-[#F2F2F7] rounded-full mb-6 p-5">

          <div className="flex size-[48px] items-center justify-center rounded-full bg-[#6D7280]/50 -4">
            <Icon name="x" size={24} className="text-secondary-foreground stroke-3" />
          </div>
        </div>

        {/* Title & Description */}
        <DialogTitle className="!text-heading-md font-bold leading-snug text-foreground mb-1">
          {settingsDict.cancelBookingTitle || "Cancel booking"}
        </DialogTitle>
        <DialogDescription className="font-normal text-body-base text-secondary-foreground">
          {settingsDict.cancelBookingDesc || "Are you sure you want to cancel this booking?"}
        </DialogDescription>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex flex-wrap-reverse w-full gap-2 sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            size="default"
            disabled={isPending}
            className="flex-1 whitespace-nowrap rounded-full border-0 bg-secondary hover:bg-secondary/80 font-medium text-secondary-foreground px-4 sm:px-8"
            onClick={() => onOpenChange(false)}
          >
            {settingsDict.noDontCancel || "No, don't cancel"}
          </Button>

          <Button
            type="button"
            variant="default"
            size="default"
            loading={isPending}
            onClick={handleCancel}
            className="flex-1 whitespace-nowrap rounded-full bg-primary text-primary-foreground hover:bg-primary/95 font-medium px-4 sm:px-8"
          >
            {settingsDict.yesCancel || "Yes, cancel"}
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
