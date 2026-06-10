"use client"

import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"

interface SuspendClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  onConfirm: () => void

}


//TODO: IMPLEMENT REAL SUSPEND LOGIC AND MUTATION AND MAKE THIS DIALOG TO BE SUPEND AND UNSUSPEND BUTTON ACCORDING TO CLIENT STATUS

export function SuspendClientDialog({ open, onOpenChange, clientName, onConfirm }: SuspendClientDialogProps) {
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
        <Icon name="forbidenCircleFill" className="text-secondary-foreground size-[40px]"/>
        </div>

        <h2 className="text-heading-md font-bold  mb-2">Suspend client</h2>
        <p className="text-secondary-foreground">
          Are you sure you want to suspend &ldquo;{clientName}&rdquo;?
        </p>

        <Separator className="my-4"/>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary-outline"
            className="flexs-1 rounded-full w-full h-[48px]"
            onClick={() => onOpenChange(false)}
          >
            No, don&apos;t suspend
          </Button>
          <Button
            className="flsex-1 rounded-full w-full h-[48px] bg-primary hover:bg-primary/90"
            onClick={() => { onConfirm(); onOpenChange(false) }}
          >
            Yes, suspend
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
