"use client"

import { useState } from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import type { Report } from "../types"
import { Separator } from "@/shared/components/ui/separator"

interface RespondReportDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export function RespondReportDialog({ report, open, onOpenChange, onBack }: RespondReportDialogProps) {
  const [response, setResponse] = useState("")

  if (!report) return null

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      isShowTopSeparator={true}
      dialogTitle={`Respond to report #${report.id}`}
    >
      <div className="flex flex-col gap-5 pt-4 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Report message</span>
          <span className="text-[15px] font-semibold text-gray-900">{report.message}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Response</span>
          <Textarea
            placeholder="Enter a response to the issue"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[120px] bg-secondary border-0 rounded-2xl resize-none focus-visible:ring-primary/20"
          />
        </div>

        <Separator />
        <div className="grid grid-cols-2 gap-3 pt-2 pb-2">
          <Button variant="secondary-outline" className="rounded-full " onClick={onBack}>
            Back
          </Button>
          <Button className="rounded-full " disabled={!response.trim()}>
            Send
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
