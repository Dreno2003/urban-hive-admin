"use client"

import React from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewPermissionsDialog({ open, onOpenChange }: DialogProps) {
  const permissions = [
    { feature: "Overview Dashboard", admin: "Read / Write", manager: "Read only", staff: "Read only" },
    { feature: "Bookings Management", admin: "Read / Write / Delete", manager: "Read / Write", staff: "Read only" },
    { feature: "Clients Records", admin: "Read / Write / Delete", manager: "Read / Write", staff: "Read only" },
    { feature: "Operations Schedule", admin: "Read / Write", manager: "Read / Write", staff: "Read / Write" },
    { feature: "Spaces Settings", admin: "Read / Write / Delete", manager: "Read / Write", staff: "Read only" },
    { feature: "Payments & Invoices", admin: "Read / Write / Refund", manager: "Read only", staff: "No access" },
    { feature: "Communications Portal", admin: "Read / Write / Send", manager: "Read / Write", staff: "No access" },
    { feature: "System Settings", admin: "Full Access", manager: "Read only", staff: "No access" },
  ]

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Team Permissions"
      contentClassName="sm:max-w-[640px]"
    >
      <div className="mt-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Below is the access matrix outlining what features each teammate role can view or modify.
        </p>

        <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="flex bg-secondary px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider uppercase border-b border-gray-150 dark:border-gray-800">
            <span className="w-[40%]">Feature Area</span>
            <span className="w-[20%] text-center">Admin</span>
            <span className="w-[20%] text-center">Manager</span>
            <span className="w-[20%] text-center">Staff</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-850">
            {permissions.map((p) => (
              <div key={p.feature} className="flex px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-[40%] font-medium text-gray-900 dark:text-white">{p.feature}</span>
                <span className="w-[20%] text-center text-xs font-semibold text-primary-300 dark:text-primary-400">{p.admin}</span>
                <span className="w-[20%] text-center text-xs text-gray-600 dark:text-gray-400">{p.manager}</span>
                <span className="w-[20%] text-center text-xs text-gray-500 dark:text-gray-500">{p.staff}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full h-10 px-6 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}

export function ViewRolesDialog({ open, onOpenChange }: DialogProps) {
  const roles = [
    {
      name: "Administrator",
      description: "Full control over organization settings, billing preferences, space operations, and team permissions. Can invite, edit, or delete any teammates.",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      name: "Manager",
      description: "Handles day-to-day client bookings, operations schedule, billing summaries, and space catalog updates. Cannot modify global payment settings or system credentials.",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      name: "Staff",
      description: "Manages check-ins, guest logs, calendar details, and direct space notifications. Has read-only access to client billing records and reports.",
      badgeColor: "bg-green-50 text-green-700 border-green-100",
    },
  ]

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Team Roles"
      contentClassName="sm:max-w-[520px]"
    >
      <div className="mt-4 space-y-5">
        <p className="text-sm text-muted-foreground">
          Roles define a teammate's default permissions level within the Urban Hive portal.
        </p>

        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.name}
              className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-gray-900 dark:text-white">
                  {role.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Role Type
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-850">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full h-10 px-6 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}
