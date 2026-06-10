"use client"

import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Trash2 } from "lucide-react"

interface RemoveClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  onConfirm: () => void
}

export function RemoveClientDialog({ open, onOpenChange, clientName, onConfirm }: RemoveClientDialogProps) {
  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      showClose={false}
      isShowTopSeparator={false}
      contentClassName="sm:max-w-[440px]"
    >
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        {/* Trash icon */}
        <div className="size-[72px] rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <Trash2 className="size-8 text-gray-500" />
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 mb-2">Remove client</h2>
        <p className="text-[14px] text-gray-500 mb-6">
          Are you sure you want to remove &ldquo;{clientName}&rdquo;?
        </p>

        <div className="flex gap-3 w-full">
          <Button
            variant="secondary-outline"
            className="flex-1 rounded-full h-[48px]"
            onClick={() => onOpenChange(false)}
          >
            No, don&apos;t remove
          </Button>
          <Button
            className="flex-1 rounded-full h-[48px] bg-primary hover:bg-primary/90"
            onClick={() => { onConfirm(); onOpenChange(false) }}
          >
            Yes, remove
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
