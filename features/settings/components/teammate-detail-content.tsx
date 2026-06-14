"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@/shared/components/ui/icon"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Pagination } from "@/shared/components/ui/pagination"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/shared/lib/utils"
import { toast } from "sonner"
import {
  useTeammateDetail,
  useTeammateActivity,
  useSuspendTeammate,
  useRemoveTeammate,
} from "../hooks/use-settings"
import type { TeammateActivityType } from "../types"
import { Button } from "@/shared/components/ui/button"

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_COLS = ["Activity", "Activity type", "Date", "Time", "Action"]
const ACTIVITY_WIDTHS = ["w-[32%]", "w-[20%]", "w-[20%]", "w-[16%]", "w-[12%]"]

const ACTIVITY_TYPE_FILTERS: Array<TeammateActivityType | "All"> = [
  "All",
  "Cancellation",
  "Booking",
  "Check-in",
  "Check-out",
  "Payment",
  "Modification",
]

const AVATAR_COLORS = [
  "bg-[#4D49FF]",
  "bg-[#7C4DFF]",
  "bg-[#E91E8C]",
  "bg-[#00BCD4]",
  "bg-[#FF6D00]",
  "bg-[#2E7D32]",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(firstName = "", lastName = "") {
  return ((firstName.charAt(0) || "") + (lastName.charAt(0) || "")).toUpperCase()
}

function getAvatarColor(id: string) {
  const num = parseInt(id.replace(/\D/g, "")) || 0
  return AVATAR_COLORS[num % AVATAR_COLORS.length]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TeammateDetailContent({ id }: { id: string }) {
  const router = useRouter()

  const [activityPage, setActivityPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isConfirmRemove, setIsConfirmRemove] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const { data: teammate, isLoading } = useTeammateDetail(id)
  const { data: activityData, isLoading: isActivityLoading } = useTeammateActivity(
    id,
    activityPage,
    typeFilter
  )

  const { mutateAsync: suspendTeammate, isPending: isSuspending } = useSuspendTeammate()
  const { mutateAsync: removeTeammate, isPending: isRemoving } = useRemoveTeammate()

  // Reset filter state when id changes
  useEffect(() => {
    setActivityPage(1)
    setTypeFilter("All")
    setIsFilterOpen(false)
    setIsConfirmRemove(false)
  }, [id])

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTypeFilterSelect = (type: string) => {
    setTypeFilter(type)
    setActivityPage(1)
    setIsFilterOpen(false)
  }

  const handleSuspend = async () => {
    if (!teammate) return
    try {
      const updated = await suspendTeammate(teammate.id)
      const action = updated.status === "Active" ? "reactivated" : "suspended"
      toast.success(`${teammate.firstName} ${teammate.lastName} has been ${action}`)
      router.push("/dashboard/settings?tab=team")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update teammate status"
      toast.error(message)
    }
  }

  const handleRemove = async () => {
    if (!teammate) return
    if (!isConfirmRemove) {
      setIsConfirmRemove(true)
      return
    }
    try {
      await removeTeammate(teammate.id)
      toast.success(`${teammate.firstName} ${teammate.lastName} has been removed`)
      router.push("/dashboard/settings?tab=team")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to remove teammate"
      toast.error(message)
    }
  }

  const activities = activityData?.activities ?? []
  const totalActivityPages = activityData?.totalPages ?? 1
  const isActive = teammate?.status === "Active"

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* ── Profile Card ─────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-[24px] px-6 py-5 mb-5">

          {/* Top row: avatar + name + action buttons */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="size-[64px] rounded-full bg-gray-200" />
              ) : (
                <div
                  className={cn(
                    "size-[64px] shrink-0 rounded-full flex items-center justify-center text-white text-[22px] font-bold overflow-hidden select-none",
                    getAvatarColor(teammate?.id ?? "")
                  )}
                >
                  {teammate?.avatar ? (
                    <img
                      src={teammate.avatar}
                      alt={`${teammate.firstName} ${teammate.lastName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(teammate?.firstName, teammate?.lastName)
                  )}
                </div>
              )}

              <div>
                <p className="text-[13px] text-secondary-foreground mb-0.5">Name</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-40 bg-gray-200" />
                ) : (
                  <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
                    {teammate?.firstName} {teammate?.lastName}
                  </h1>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={'secondary-outline'}
                // className="rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[13px] px-5 h-[38px] transition-colors cursor-pointer select-none whitespace-nowrap"
              >
                Permissions
              </Button>

              <Button
                type="button"
                onClick={handleSuspend}
                disabled={isSuspending || isLoading}
                variant={'secondary-outline'}
                // className={cn(
                //   "rounded-full border text-[13px] px-5 h-[38px] transition-colors cursor-pointer select-none whitespace-nowrap",
                //   isActive
                //     ? "border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-gray-700"
                //     : "border-green-200 bg-green-50 hover:bg-green-100 text-green-700",
                //   (isSuspending || isLoading) && "opacity-60 cursor-not-allowed"
                // )}
              >
                {isSuspending
                  ? "Updating..."
                  : isActive
                    ? "Suspend team member"
                    : "Reactivate team member"}
              </Button>

              <Button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving || isLoading}
                className={cn(
                  "rounded-full border  transition-colors cursor-pointer select-none whitespace-nowrap",
                  isConfirmRemove
                    ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                    : "bg-[#FFF0F0] text-red-500 hover:bg-red-50 border border-red-100",
                  (isRemoving || isLoading) && "opacity-60 cursor-not-allowed"
                )}
              >
                {isRemoving ? "Removing..." : isConfirmRemove ? "Confirm remove?" : "Remove team member"}
              </Button>
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Info Grid */}
          <div className="grid grid-cols-4 gap-6">
            {/* Status */}
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Status</p>
              {isLoading ? (
                <Skeleton className="h-5 w-16 bg-gray-200" />
              ) : (
                <Badge
                  variant={isActive ? "success-outline" : "default-outline"}
                  iconName="circle"
                  iconClassName="!size-2.5"
                  className="!py-3"
                >
                  {teammate?.status}
                </Badge>
              )}
            </div>

            {/* Role */}
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Role</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20 bg-gray-200" />
              ) : (
                <p className="text-[14px] font-medium">
                  {teammate?.role}
                </p>
              )}
            </div>

            {/* Client Email */}
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Client email</p>
              {isLoading ? (
                <Skeleton className="h-5 w-44 bg-gray-200" />
              ) : (
                <p className="text-[14px] font-medium">
                  {teammate?.email}
                </p>
              )}
            </div>

            {/* Client Phone */}
            <div>
              <p className="text-[12px] text-secondary-foreground mb-1">Client phone number</p>
              {isLoading ? (
                <Skeleton className="h-5 w-32 bg-gray-200" />
              ) : (
                <p className="text-[14px] font-medium">
                  {teammate?.phone ?? "—"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Activity Log Card ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-[24px]">

          {/* Activity Log Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h4 className="text-[17px] font-bold tracking-tight">Activity log</h4>

            {/* Filter Dropdown */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-semibold px-4 py-2 transition-colors cursor-pointer select-none"
              >
                <Icon name="sort" size={13} className="text-gray-400" />
                Filter
                <Icon
                  name="chevronDown"
                  size={12}
                  className={cn(
                    "text-gray-400 transition-transform duration-200",
                    isFilterOpen && "rotate-180"
                  )}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden min-w-[160px] py-1">
                  {ACTIVITY_TYPE_FILTERS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeFilterSelect(type)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors",
                        type === typeFilter
                          ? "text-primary-300 bg-gray-50/60"
                          : "text-gray-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="flex items-center bg-[#F7F7F8] px-6 py-3.5 border-y border-gray-100">
            {/* Checkbox placeholder col */}
            <div className="w-8 shrink-0">
              <div className="size-4 rounded border border-gray-200 bg-white" />
            </div>
            {ACTIVITY_COLS.map((col, idx) => (
              <span
                key={col}
                className={cn(
                  "text-[12px] font-semibold text-gray-500 tracking-wide",
                  ACTIVITY_WIDTHS[idx]
                )}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Table Rows */}
          <div className="flex flex-col divide-y divide-gray-50 min-h-[116px]">
            {isActivityLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-5 gap-4 animate-pulse">
                  <Skeleton className="w-4 h-4 rounded bg-gray-100 shrink-0" />
                  {ACTIVITY_WIDTHS.map((w, j) => (
                    <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />
                  ))}
                </div>
              ))
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-1.5">
                <p className="text-[14px] font-semibold text-gray-900">No activity found</p>
                <p className="text-xs text-gray-400">No records match the selected filter</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center px-6 py-4 hover:bg-gray-50/40 transition-colors"
                >
                  {/* Checkbox */}
                  <div className="w-8 shrink-0">
                    <div className="size-4 rounded border border-gray-200 bg-white cursor-pointer hover:border-gray-400 transition-colors" />
                  </div>

                  {/* Activity */}
                  <span className={cn("text-[13px] font-medium text-gray-800 pr-3", ACTIVITY_WIDTHS[0])}>
                    {activity.activity}
                  </span>

                  {/* Activity Type */}
                  <span className={cn("text-[13px] text-gray-600", ACTIVITY_WIDTHS[1])}>
                    {activity.activityType}
                  </span>

                  {/* Date */}
                  <span className={cn("text-[13px] text-gray-600", ACTIVITY_WIDTHS[2])}>
                    {activity.date}
                  </span>

                  {/* Time */}
                  <span className={cn("text-[13px] text-gray-600", ACTIVITY_WIDTHS[3])}>
                    {activity.time}
                  </span>

                  {/* View */}
                  <button
                    type="button"
                    className={cn(
                      "text-[13px] text-primary-300 font-semibold cursor-pointer hover:underline text-left",
                      ACTIVITY_WIDTHS[4]
                    )}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <Separator />
          <div className="px-6 pb-5 pt-1">
            <Pagination
              currentPage={activityPage}
              totalPages={totalActivityPages}
              onPageChange={setActivityPage}
              variant="default"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
