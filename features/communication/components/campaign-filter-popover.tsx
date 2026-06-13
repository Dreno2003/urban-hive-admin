"use client"

import React, { useState, useMemo } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { useIsMobile } from "@/shared/hooks/use-mobile"
import type { CampaignCategory, CampaignFilters } from "../types"

interface CampaignFilterPopoverProps {
  value: CampaignFilters
  onChange: (filters: CampaignFilters) => void
}

type FilterTab = "category" | "date"

function countActiveFilters(f: CampaignFilters): number {
  let n = 0
  if (f.categories.length) n += f.categories.length
  if (f.dateFrom || f.dateTo) n += 1
  return n
}

const emptyFilters = (): CampaignFilters => ({
  categories: [],
  dateFrom: "",
  dateTo: "",
})

export function CampaignFilterPopover({ value, onChange }: CampaignFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("category")
  const [draft, setDraft] = useState<CampaignFilters>(value)
  const isMobile = useIsMobile()
  const appliedCount = countActiveFilters(value)
  const draftCount = countActiveFilters(draft)

  const CATEGORY_OPTIONS = useMemo<{ value: CampaignCategory; label: string }[]>(
    () => [
      { value: "Newsletter", label: "Newsletter" },
      { value: "Promotional offer", label: "Promotional offer" },
      { value: "Holiday message", label: "Holiday message" },
      { value: "Satisfaction survey", label: "Satisfaction survey" },
    ],
    []
  )

  const TABS = useMemo(
    () => [
      { id: "category" as FilterTab, label: "Category", iconName: "widgetOutline" as const },
      { id: "date" as FilterTab, label: "Date", iconName: "calendar" as const },
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

  const toggleCategory = (v: CampaignCategory) =>
    setDraft((p) => ({
      ...p,
      categories: p.categories.includes(v)
        ? p.categories.filter((c) => c !== v)
        : [...p.categories, v],
    }))

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      {/* ── Trigger ─────────────────────────────────────────────────────────── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-1.5 h-[36px] px-4 rounded-[32px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
            appliedCount > 0 ? "bg-primary/5 text-primary" : "bg-[#F2F2F7] dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-750"
          )}
        >
          <Icon name="sort" size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
          Filter
          {appliedCount > 0 && <span className="text-primary font-semibold">({appliedCount})</span>}
          <Icon name="chevronDown" size={16} className="text-gray-500 dark:text-gray-400 ml-0.5" />
        </button>
      </PopoverTrigger>

      {/* ── Popover card ── */}
      <PopoverContent
        align={isMobile ? "center" : "end"}
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={isMobile ? 16 : 0}
        className="w-[calc(100vw-32px)] sm:w-[500px] px-4 sm:px-6 rounded-[24px] sm:rounded-[32px] shadow-2xl border-0 outline-none bg-white dark:bg-gray-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 items-center justify-between py-4">
          <span className="text-base font-bold text-gray-900 dark:text-white">Filter campaigns</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size={"sm"}
              variant="secondary-outline"
              onClick={() => setDraft(emptyFilters())}
              className="rounded-full text-sm text-gray-700 dark:text-gray-300 dark:border-gray-800"
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
          <div className="w-[100px] sm:w-[130px] space-y-3 border-r border-gray-100 dark:border-gray-800 pr-3 sm:pr-5 shrink-0 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-[5px] text-sm transition-colors cursor-pointer w-full text-left rounded-[8px]",
                  activeTab === tab.id
                    ? "bg-[#F2F2F7] dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon
                  name={tab.iconName}
                  size={16}
                  className={activeTab === tab.id ? "text-gray-9050 dark:text-white" : "text-gray-400"}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 pr-2 sm:pr-5 pl-4 sm:pl-6 pt-1 min-w-0">
            {/* Category */}
            {activeTab === "category" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Campaign category</p>
                <div className="space-y-2.5">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox
                        checked={draft.categories.includes(opt.value)}
                        onCheckedChange={() => toggleCategory(opt.value)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date */}
            {activeTab === "date" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Date range</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 dark:text-gray-500 font-medium">From</label>
                    <Input
                      type="date"
                      value={draft.dateFrom}
                      onChange={(e) => setDraft((p) => ({ ...p, dateFrom: e.target.value }))}
                      className="w-full h-10 rounded-full text-sm text-gray-900 dark:text-white dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 dark:text-gray-500 font-medium">To</label>
                    <Input
                      type="date"
                      value={draft.dateTo}
                      min={draft.dateFrom}
                      onChange={(e) => setDraft((p) => ({ ...p, dateTo: e.target.value }))}
                      className="w-full h-10 rounded-full text-sm text-gray-900 dark:text-white dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
