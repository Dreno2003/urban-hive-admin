"use client"

import { useState } from "react"
import { Icon } from "@/shared/components/ui/icon"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { useIsMobile } from "@/shared/hooks/use-mobile"

export interface ReportFilters {
  statuses: string[]
  categories: string[]
  dateFrom: string
  dateTo: string
}

interface ReportsFilterPopoverProps {
  value: ReportFilters
  onChange: (filters: ReportFilters) => void
}

type FilterTab = "date" | "status" | "category"

const STATUS_OPTIONS = [
  { value: "resolved", label: "Resolved" },
  { value: "pending",  label: "Pending"  },
  { value: "open",     label: "Open"     },
]

const CATEGORY_OPTIONS = [
  { value: "facilities",   label: "Facilities"   },
  { value: "safety",       label: "Safety"       },
  { value: "other",        label: "Other"        },
]

const TABS: { id: FilterTab; label: string; iconName: "calendar" | "loader" | "building2" }[] = [
  { id: "date",     label: "Date",     iconName: "calendar"  },
  { id: "status",   label: "Status",   iconName: "loader"    },
  { id: "category", label: "Category", iconName: "building2" },
]

const emptyFilters = (): ReportFilters => ({ statuses: [], categories: [], dateFrom: "", dateTo: "" })

function countActive(f: ReportFilters) {
  let n = 0
  if (f.statuses.length)   n += f.statuses.length
  if (f.categories.length) n += f.categories.length
  if (f.dateFrom || f.dateTo) n += 1
  return n
}

export function ReportsFilterPopover({ value, onChange }: ReportsFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("date")
  const [draft, setDraft] = useState<ReportFilters>(value)
  const isMobile = useIsMobile()

  const appliedCount = countActive(value)
  const draftCount   = countActive(draft)

  const handleOpen = (next: boolean) => {
    if (next) setDraft(value)
    setOpen(next)
  }

  const toggleStatus   = (v: string) => setDraft(p => ({ ...p, statuses:   p.statuses.includes(v)   ? p.statuses.filter(s => s !== v)   : [...p.statuses, v]   }))
  const toggleCategory = (v: string) => setDraft(p => ({ ...p, categories: p.categories.includes(v) ? p.categories.filter(s => s !== v) : [...p.categories, v] }))

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary-outline"
          className={cn("rounded-full px-4 h-[36px]", appliedCount > 0 && "bg-primary/5 text-primary")}
        >
          <Icon name="sort" size={16} className="text-secondary-foreground shrink-0" />
          Filter
          {appliedCount > 0 && <span className="text-primary font-semibold">({appliedCount})</span>}
          <Icon name="chevronDown" size={16} className="text-secondary-foreground ml-0.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile ? "center" : "end"}
        sideOffset={8}
        avoidCollisions
        collisionPadding={isMobile ? 16 : 0}
        className="w-[calc(100vw-32px)] sm:w-[574px] px-4 sm:px-6 rounded-[24px] sm:rounded-[32px] shadow-2xl border-0 bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b py-2">
          <span className="text-base font-bold">Filter</span>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="secondary-outline" className="rounded-full w-[71px] text-black" onClick={() => setDraft(emptyFilters())}>
              {draftCount > 0 ? `Reset(${draftCount})` : "Reset"}
            </Button>
            <Button type="button" size="sm" className="rounded-full px-4" onClick={() => { onChange(draft); setOpen(false) }}>
              Apply filter(s)
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex pt-2 pb-4">
          {/* Sidebar */}
          <div className="w-[100px] sm:w-[130px] border-r pr-3 sm:pr-5 shrink-0 flex flex-col gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-[5px] text-sm w-full text-left rounded-[8px] transition-colors cursor-pointer",
                  activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-gray-500 hover:text-foreground"
                )}
              >
                <Icon name={tab.iconName} size={16} className={activeTab === tab.id ? "text-foreground" : "text-secondary-foreground"} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 pl-4 sm:pl-6 pr-2 pt-1 min-w-0">
            {activeTab === "date" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs  font-medium">When</label>
                    <Input type="date" value={draft.dateFrom} onChange={e => setDraft(p => ({ ...p, dateFrom: e.target.value }))} className="w-full h-10 rounded-full text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs  font-medium">To</label>
                    <Input type="date" value={draft.dateTo} min={draft.dateFrom} onChange={e => setDraft(p => ({ ...p, dateTo: e.target.value }))} className="w-full h-10 rounded-full text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">Status</p>
                <div className="space-y-2.5">
                  {STATUS_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox checked={draft.statuses.includes(opt.value)} onCheckedChange={() => toggleStatus(opt.value)} />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "category" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">Category</p>
                <div className="space-y-2.5">
                  {CATEGORY_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox checked={draft.categories.includes(opt.value)} onCheckedChange={() => toggleCategory(opt.value)} />
                      <span className="text-sm">{opt.label}</span>
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
