"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import type { Campaign } from "../types"

interface DraftsListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drafts: Campaign[]
  onEditDraft: (campaign: Campaign) => void
}

export function DraftsListDialog({ open, onOpenChange, drafts, onEditDraft }: DraftsListDialogProps) {
  return (
    <DialogContainer
      dialogTitle="Drafts"
      className="pb-1 !px-3"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4 pt-1">
        {drafts.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
            No draft campaigns found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex justify-between items-center py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <h5 className="text-[15px] font-medium text-gray-900 dark:text-white truncate">
                      {draft.title}
                    </h5>
                    <span className="px-2.5 py-1  text-xs rounded-md border border-gray-200 dark:border-gray-800 bg-transparent text-[#6D7280] dark:text-gray-400 text-body-sm font-medium tracking-wide">
                      {draft.category}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1 pr-4">
                    {draft.description}
                  </p>
                </div>
                <button
                  onClick={() => onEditDraft(draft)}
                  type="button"
                  className="flex items-center gap-1.5 h-[32px] px-3.5 rounded-full bg-[#F2F2F7] dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-700 text-xs font-semibold cursor-pointer border-0 transition-all shrink-0"
                >
                  <Icon name="pencil" size={12} className="text-gray-500 dark:text-gray-400" />
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        <div className="pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
