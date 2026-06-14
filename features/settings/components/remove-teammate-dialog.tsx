"use client"

import React, { useState, useEffect } from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { PasswordInput } from "@/shared/components/ui/password-input"
import type { Teammate } from "../types"

interface RemoveTeammateDialogProps {
  teammate: Teammate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmRemove: () => Promise<void>
  isRemoving: boolean
}

type DialogView = "confirm" | "password"

export function RemoveTeammateDialog({
  teammate,
  open,
  onOpenChange,
  onConfirmRemove,
  isRemoving,
}: RemoveTeammateDialogProps) {
  const [view, setView] = useState<DialogView>("confirm")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Reset state on open/close
  useEffect(() => {
    if (!open) {
      setView("confirm")
      setPassword("")
      setError("")
    }
  }, [open])

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setView("confirm")
      setPassword("")
      setError("")
    }
    onOpenChange(isOpen)
  }

  const handleBack = () => {
    setView("confirm")
    setPassword("")
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError("Password is required")
      return
    }
    try {
      setError("")
      await onConfirmRemove()
      handleClose(false)
    } catch (err: any) {
      setError(err.message || "Failed to remove teammate")
    }
  }

  if (!teammate) return null

  const teammateName = `${teammate.firstName} ${teammate.lastName}`

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      dialogTitle=""
      isShowTopSeparator={false}
      showClose={view === "confirm"}
      contentClassName="sm:max-w-[440px] px-0"
    >
      {view === "confirm" ? (
        <div className="flex flex-col items-center text-center px-4 pt-4 pb-2">
          {/* Circular Trash Icon */}
          <div className="size-14 rounded-full bg-secondary flex items-center justify-center mb-5">
            <Icon name="trash2" size={24} className="text-gray-500" />
          </div>

          <h3 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
            Remove team member
          </h3>
          <p className="text-[13.5px] text-gray-500 dark:text-gray-400 max-w-[320px] leading-relaxed mb-8">
            Are you sure you want to remove "{teammateName}" from this workspace?
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleClose(false)}
              className="rounded-full h-11 text-sm bg-secondary hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-0 cursor-pointer"
            >
              No, don't remove
            </Button>
            <Button
              type="button"
              onClick={() => setView("password")}
              className="rounded-full h-11 text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Yes, remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-2 pb-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer mb-6 border border-gray-200 dark:border-gray-700 rounded-full px-3.5 py-1.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850"
          >
            <Icon name="chevronLeft" size={12} className="text-gray-400" />
            Back
          </button>

          <h3 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">
            Enter your password
          </h3>
          <p className="text-[13.5px] text-gray-500 dark:text-gray-400 mb-6">
            Enter your password to complete this action
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2 ml-1">
                Password
              </label>
              <PasswordInput
                name="password"
                placeholder="Enter your password"
                isShowEndIcon={true}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                error={error}
                className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
              />
            </div>

            <Button
              type="submit"
              loading={isRemoving}
              className="w-full h-11 rounded-full text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Enter
            </Button>
          </form>
        </div>
      )}
    </DialogContainer>
  )
}
