"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Separator } from "@/shared/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import type { TeammateActivity } from "../types"

interface ActivityDetailDialogProps {
  activity: TeammateActivity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11.5px] text-gray-400 font-medium">{label}</span>
      <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{children}</div>
    </div>
  )
}

export function ActivityDetailDialog({ activity, open, onOpenChange }: ActivityDetailDialogProps) {
  if (!activity) return null

  return (
    <DialogContainer
      dialogTitle="Activity log"
      open={open}
      onOpenChange={onOpenChange}
      className="!px-2 pb-2"
    >
      <div className="flex flex-col gap-0 mt-2">
        {/* Row 1 — Activity + Activity Type */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Activity">
            <span className="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 underline hover:no-underline cursor-pointer">
              {activity.activity}
              <Icon name="exportSquareOutline" className="size-3.5 text-secondary-foreground shrink-0" />
            </span>
          </Field>
          <Field label="Activity type">
            <span className="text-gray-900 dark:text-gray-100">
              {activity.activityType}
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />

        {/* Row 2 — Date + Time */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <Field label="Date">
            <span className="text-gray-900 dark:text-gray-100">
              {activity.date}
            </span>
          </Field>
          <Field label="Time">
            <span className="text-gray-900 dark:text-gray-100">
              {activity.time}
            </span>
          </Field>
        </div>

        <Separator className="bg-gray-100" />
      </div>

      {/* Actions */}
      <div className="pt-4 pb-2">
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full h-12 rounded-full text-[14px] bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Close
        </Button>
      </div>
    </DialogContainer>
  )
}
