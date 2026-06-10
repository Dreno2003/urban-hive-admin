"use client"

import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
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
      // showClose={false}
      isShowTopSeparator={false}
      contentClassName="sm:max-w-lg"
    >
      <div className="flex flex-col items-center text-center -mt-2 pb-4">
        {/* Trash icon */}
        <div className="size-[72px] rounded-full bg-secondary flex items-center justify-center mb-5">
        <Icon name="trash2" className="text-secondary-foreground size-[40px]"/>
        </div>

        <h2 className="text-heading-md font-bold  mb-2">Remove client</h2>
        <p className="text-secondary-foreground">
          Are you sure you want to remove &ldquo;{clientName}&rdquo;?
        </p>

        <Separator className="my-4"/>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary-outline"
            className="flexs-1 rounded-full w-full h-[48px]"
            onClick={() => onOpenChange(false)}
          >
            No, don&apos;t remove
          </Button>
          <Button
            className="flsex-1 rounded-full w-full h-[48px] bg-primary hover:bg-primary/90"
            onClick={() => { onConfirm(); onOpenChange(false) }}
          >
            Yes, remove
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
