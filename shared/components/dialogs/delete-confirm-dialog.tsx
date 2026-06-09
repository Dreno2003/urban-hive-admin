"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "../ui/icon"

export interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The document/item name shown in the description */
  itemName?: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <DialogContainer isShowTopSeparator={false} open={open} onOpenChange={onOpenChange} contentClassName="">
      <div className="flex flex-col items-center text-center py-">
        {/* Icon */}
        <div className="size-[80px] rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon name="trash2" className="size-[46px] text-gray-500" />
        </div>

        {/* Heading */}
        <h2 className="text-[20px] font-bold text-gray-900 tracking-tight mb-2">
          Delete guide document?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Are you sure you want to remove{" "}
          {itemName ? <>&quot;{itemName}&quot; document</> : "this document"}{" "}
          from this workspace?
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => onOpenChange(false)}
            className="h-[44px] flex-1 rounded-full text-[14px]"
            disabled={loading}
          >
            No, don&apos;t remove
          </Button>
          <Button
            type="button"
            loading={loading}
            onClick={handleConfirm}
            className="h-[44px] flex-1 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90"
          >
            Yes, remove
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}

export default DeleteConfirmDialog
