"use client"

import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import type { Report } from "../types"

interface ReportDetailsDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-[15px] font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function FieldWithLink({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-semibold text-gray-900">{value}</span>
        <Icon name="exportSquareOutline" size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
    </div>
  )
}

export function ReportDetailsDialog({ report, open, onOpenChange }: ReportDetailsDialogProps) {
  if (!report) return null

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      isShowTopSeparator={false}
      contentClassName="px-1"
      dialogTitle={
        <div className="flex items-center gap-3">
          <span>Report details</span>
          <Button size={'sm'} variant="secondary-outline" className="rounded-full text-xs text-[#5F6979] h-[28px] gap-x-1">
            {/* <Button variant="secondary-outline"className="flex items-center gap-1.5 text-xs text-gray-400 px-2 font-normal hover:text-gray-600 transition-colors"> */}
            <Icon name="flag" size={14} />
            Set this report to resolved
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-y-5">
          <FieldWithLink label="Client name" value={report.clientName} />
          <FieldWithLink label="Space reported" value={report.space} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-y-5">
          <Field label="Report category" value={report.category} />
          <Field label="Report Title" value={report.title} />
        </div>

        <Separator />

        <Field label="Report message" value={report.message} />

        <Separator />

        <Field label="Date" value={report.date} />
        <Separator />

        <div className="grid grid-cols-2 gap-3 pt-2 pb-2">
          <Button
            variant="secondary-outline"
            className="rounded-full "
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button className="rounded-full ">
            Respond
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
