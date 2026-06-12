"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { toast } from "sonner"
import type { SpaceActivity } from "../types"

interface ActivityDetailDialogProps {
  activity: SpaceActivity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityDetailDialog({
  activity,
  open,
  onOpenChange,
}: ActivityDetailDialogProps) {
  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Space activity"
      isShowTopSeparator={true}
      contentClassName="sm:max-w-[480px]"
      className="pb-4"
    >
      <div className="py-2 space-y-4 text-[13.5px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Booked by</span>
            <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
              <span className=" underline-offset-3 cursor-pointer">{activity?.bookedBy}</span>
              <button
                onClick={() => toast.info("Opening client link")}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0 bg-transparent border-none"
              >
                <Icon name="exportSquareOutline" size={13} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Date booked</span>
            <span className="font-medium text-body-lg dark:text-white">{activity?.dateBooked}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Check in</span>
            <span className="font-medium text-body-lg dark:text-white">{activity?.checkIn}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Check out</span>
            <span className="font-medium text-body-lg dark:text-white">{activity?.checkOut}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Duration</span>
            <span className="font-medium text-body-lg  dark:text-white">{activity?.duration}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-secondary-foreground  tracking-wide">Status</span>
            <span className="font-medium  text-body-lg dark:text-white">
              {activity?.status === "Complete" ? "Completed" : activity?.status}
            </span>
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div className="flex flex-col gap-1">
          <span className="text-[14px] font- text-secondary-foreground tracking-wide">Feedback</span>
          <p className=" dark:text-gray-300 text-body-lg font-medium leading-relaxed">
            {activity?.feedback || "No feedback left."}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[14px] font- text-gray-400 uppercase tracking-wide">Report</span>
          <p className=" dark:text-gray-300 text-body-lg font-medium leading-relaxed">
            {activity?.report || "No reports submitted."}
          </p>
        </div>

        <div className="pt-2">
          <Button
            className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold text-[14px]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
