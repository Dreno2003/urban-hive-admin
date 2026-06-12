"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/shared/components/ui/dialog"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"
import { Separator } from "../ui/separator"

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DialogContainerProps {
  /** Controls open state from the parent */
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Override the default max-width / sizing classes on DialogContent */
  contentClassName?: string
  /** Extra classes applied to the inner padding wrapper */
  className?: string
  /** Hides the top-right close button when false (default: true) */
  showClose?: boolean
  dialogTitle?:string | React.ReactNode
  children: React.ReactNode
  isShowTopSeparator?:boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DialogContainer
 *
 * A shared layout shell for Urban Hive dialogs.
 * Provides:
 *  - Consistent rounded-card surface with no border
 *  - Top-right close button using the Icon library
 *  - Composable children slot — drop any dialog body inside
 *
 * Usage:
 * ```tsx
 * <DialogContainer open={open} onOpenChange={setOpen}>
 *   <DialogTitle>...</DialogTitle>
 *   ...
 * </DialogContainer>
 * ```
 */
export function DialogContainer({
  open,
  onOpenChange,
  contentClassName,
  className,
  showClose = true,
  dialogTitle,
  children,
  isShowTopSeparator = true
}: DialogContainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          // Default surface — matches Urban Hive card language
          "w-full  sm:max-w-xl rounded-3xl md:!rounded-[32px] bg-white border-0 px-2",
          contentClassName
        )}
      >


        {/* ── Close button ─────────────────────────────────────── */}

        {/* ── Content slot ─────────────────────────────────────── */}
        <div className={cn("px-3 md:px-8 p", className)}>
          <div className="flex justify-between items-center ">



            <h2 className="text-[22px] font-bold  dark:text-gray-50 tracking-tight ">


              {/* {isEditing ? "Edit guide" : "Add guide"} */}
              {dialogTitle}
            </h2>

            {showClose && (
              <DialogClose asChild>
                <button
                  aria-label="Close dialog"
                  className="absoslute top-4 right-4 inline-flex h-8 w-8 md:size-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon name="x" size={16} className="text-secondary-foreground" />
                </button>
              </DialogClose>
            )}

          </div>
          {
            isShowTopSeparator &&  <Separator className="my-3  dark:bg-gray-800" />
          }
          
          {children}</div>
        {/* <div className={cn("px-3 md:px-8 py-8", className)}>{children}</div> */}
      </DialogContent>
    </Dialog>
  )
}

export default DialogContainer
