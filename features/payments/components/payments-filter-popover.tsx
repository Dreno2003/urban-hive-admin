"use client"

import React, { useState, useMemo } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { useIsMobile } from "@/shared/hooks/use-mobile"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentFilters {
  statuses: string[]
  spaceTypes: string[]
  dateFrom: string
  dateTo: string
}

interface PaymentsFilterPopoverProps {
  value: PaymentFilters
  onChange: (filters: PaymentFilters) => void
}

type FilterTab = "date" | "status" | "space"

function countActiveFilters(f: PaymentFilters): number {
  let n = 0
  if (f.statuses.length) n += f.statuses.length
  if (f.spaceTypes.length) n += f.spaceTypes.length
  if (f.dateFrom || f.dateTo) n += 1
  return n
}

const emptyFilters = (): PaymentFilters => ({
  statuses: [],
  spaceTypes: [],
  dateFrom: "",
  dateTo: "",
})

export function PaymentsFilterPopover({ value, onChange }: PaymentsFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("date")
  const [draft, setDraft] = useState<PaymentFilters>(value)
  const isMobile = useIsMobile()
  const appliedCount = countActiveFilters(value)
  const draftCount = countActiveFilters(draft)

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "refunded", label: "Refunded" },
    ],
    []
  )

  const SPACE_OPTIONS = useMemo(
    () => [
      { value: "shortlet", label: "Shortlet apartment" },
      { value: "office", label: "Office" },
      { value: "boardroom", label: "Boardroom" },
    ],
    []
  )

  const TABS = useMemo(
    () => [
      { id: "date" as FilterTab, label: "Date", iconName: "calendar" as const },
      { id: "status" as FilterTab, label: "Status", iconName: "loader" as const },
      { id: "space" as FilterTab, label: "Space", iconName: "widgetOutline" as const }, // Or fallback icon
    ],
    []
  )

  const handleOpen = (next: boolean) => {
    if (next) setDraft(value)
    setOpen(next)
  }

  const handleApply = () => {
    onChange(draft)
    setOpen(false)
  }

  const toggleStatus = (v: string) =>
    setDraft((p) => ({
      ...p,
      statuses: p.statuses.includes(v) ? p.statuses.filter((s) => s !== v) : [...p.statuses, v],
    }))

  const toggleSpace = (v: string) =>
    setDraft((p) => ({
      ...p,
      spaceTypes: p.spaceTypes.includes(v) ? p.spaceTypes.filter((s) => s !== v) : [...p.spaceTypes, v],
    }))

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      {/* ── Trigger ─────────────────────────────────────────────────────────── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-1.5 w-[104px] h-[36px] px-4 rounded-[32px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
            appliedCount > 0 ? "bg-primary/5 text-primary" : "bg-[#F2F2F7] text-gray-700 hover:bg-gray-150"
          )}
        >
          <Icon name="sort" size={16} className="text-gray-500 shrink-0" />
          Filter
          {appliedCount > 0 && <span className="text-primary font-semibold">({appliedCount})</span>}
          <Icon name="chevronDown" size={16} className="text-gray-500 ml-0.5" />
        </button>
      </PopoverTrigger>

      {/* ── Popover card ── */}
      <PopoverContent
        align={isMobile ? "center" : "end"}
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={isMobile ? 16 : 0}
        className="w-[calc(100vw-32px)] sm:w-[574px] px-4 sm:px-6 rounded-[24px] sm:rounded-[32px] shadow-2xl border-0 outline-none bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex border-b items-center justify-between py-4">
          <span className="text-base font-bold text-gray-900">Filter payments</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size={"sm"}
              variant="secondary-outline"
              onClick={() => setDraft(emptyFilters())}
              className="rounded-full text-sm text-gray-700"
            >
              Reset{draftCount > 0 ? ` (${draftCount})` : ""}
            </Button>
            <Button
              size={"sm"}
              type="button"
              onClick={handleApply}
              className="text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 transition-colors cursor-pointer"
            >
              Apply filter(s)
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="pt-2 flex pb-6">
          {/* Sidebar */}
          <div className="w-[100px] sm:w-[130px] space-y-3 border-r pr-3 sm:pr-5 shrink-0 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-[5px] text-sm transition-colors cursor-pointer w-full text-left rounded-[8px]",
                  activeTab === tab.id
                    ? "bg-[#F2F2F7] text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Icon
                  name={tab.iconName}
                  size={16}
                  className={activeTab === tab.id ? "text-gray-900" : "text-gray-400"}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 pr-2 sm:pr-5 pl-4 sm:pl-6 pt-1 min-w-0">
            {/* Date */}
            {activeTab === "date" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Date range</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium">From</label>
                    <Input
                      type="date"
                      value={draft.dateFrom}
                      onChange={(e) => setDraft((p) => ({ ...p, dateFrom: e.target.value }))}
                      className="w-full h-10 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium">To</label>
                    <Input
                      type="date"
                      value={draft.dateTo}
                      min={draft.dateFrom}
                      onChange={(e) => setDraft((p) => ({ ...p, dateTo: e.target.value }))}
                      className="w-full h-10 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {activeTab === "status" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Payment status</p>
                <div className="space-y-2.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox
                        checked={draft.statuses.includes(opt.value)}
                        onCheckedChange={() => toggleStatus(opt.value)}
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Space */}
            {activeTab === "space" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Space type</p>
                <div className="space-y-2.5">
                  {SPACE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox
                        checked={draft.spaceTypes.includes(opt.value)}
                        onCheckedChange={() => toggleSpace(opt.value)}
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
