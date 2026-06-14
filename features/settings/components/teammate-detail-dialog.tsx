"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import type { Teammate } from "../types"

interface TeammateDetailDialogProps {
  teammate: Teammate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeammateDetailDialog({ teammate, open, onOpenChange }: TeammateDetailDialogProps) {
  if (!teammate) return null

  const getInitials = () => {
    const first = teammate.firstName ? teammate.firstName.charAt(0) : ""
    const last = teammate.lastName ? teammate.lastName.charAt(0) : ""
    return (first + last).toUpperCase()
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Teammate profile"
      contentClassName="sm:max-w-[440px]"
    >
      <div className="mt-4 flex flex-col items-center text-center">
        {/* Large Avatar */}
        <div className="size-20 rounded-full bg-[#4D49FF] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-inner">
          {teammate.avatar ? (
            <img
              src={teammate.avatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials()
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {teammate.firstName} {teammate.lastName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
          {teammate.email}
        </p>

        {/* Details List */}
        <div className="w-full border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-900/30 text-left space-y-3.5 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Teammate ID</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">{teammate.id}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Role</span>
            <Badge variant="default-outline" className="!h-fit">
              {teammate.role}
            </Badge>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Status</span>
            <Badge variant="default-outline" className="gap-1.5 px-2.5 !h-fit">
              <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
              {teammate.status}
            </Badge>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Date joined</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{teammate.dateJoined}</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full h-11 rounded-full text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Close
        </Button>
      </div>
    </DialogContainer>
  )
}
