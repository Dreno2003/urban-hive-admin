"use client";

import React, { useState } from "react";
import { Icon } from "@/shared/components/ui/icon";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export interface ClientFilters {
  statuses: string[];
  dateFrom: string;
  dateTo: string;
}

interface ClientsFilterPopoverProps {
  value: ClientFilters;
  onChange: (filters: ClientFilters) => void;
}

type FilterTab = "date" | "status";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
];

const TABS: { id: FilterTab; label: string; iconName: "calendar" | "loader" }[] = [
  { id: "date", label: "Date", iconName: "calendar" },
  { id: "status", label: "Status", iconName: "loader" },
];

function countActiveFilters(f: ClientFilters): number {
  let n = 0;
  if (f.statuses.length) n += f.statuses.length;
  if (f.dateFrom || f.dateTo) n += 1;
  return n;
}

const emptyFilters = (): ClientFilters => ({ statuses: [], dateFrom: "", dateTo: "" });

export function ClientsFilterPopover({ value, onChange }: ClientsFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("date");
  const [draft, setDraft] = useState<ClientFilters>(value);
  const isMobile = useIsMobile();

  const appliedCount = countActiveFilters(value);
  const draftCount = countActiveFilters(draft);

  const handleOpen = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const toggleStatus = (v: string) =>
    setDraft((p) => ({
      ...p,
      statuses: p.statuses.includes(v) ? p.statuses.filter((s) => s !== v) : [...p.statuses, v],
    }));

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
        variant={'secondary-outline'}
          type="button"
          className={cn(
            "flex items-center justify-center gap-1.5 w-[109px] h-[36px] px-6 rounded-[32px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
            // appliedCount > 0 ? "bg-primary/5 text-primary" : "bg-secondary text-foreground",
          )}
        >
          <Icon name="sort" size={16} className="text-secondary-foreground shrink-0" />
          Filter
          {appliedCount > 0 && <span className="text-prsimary font-medium">({appliedCount})</span>}
          <Icon name="chevronDown" size={16} className="text-secondary-foreground ml-0.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile ? "center" : "end"}
        sideOffset={8}
        avoidCollisions
        collisionPadding={isMobile ? 16 : 0}
        className="w-[calc(100vw-32px)] sm:w-[574px] px-4 sm:px-6 rounded-[24px] sm:rounded-[32px] shadow-2xl ring-0! border-0 outline-none bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex border-b items-center justify-between py-2">
          <span className="text-base font-bold text-foreground">Filter</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary-outline"
              onClick={() => setDraft(emptyFilters())}
              className="rounded-full text-sm w-[71px] text-black"
            >
              {draftCount > 0 ? `Reset(${draftCount})` : "Reset"}
            </Button>
            <Button
              size="sm"
              type="button"
              onClick={() => { onChange(draft); setOpen(false); }}
              className="text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 cursor-pointer"
            >
              Apply filter(s)
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="pt-2 flex pb-4">
          {/* Sidebar */}
          <div className="w-[100px] sm:w-[130px] border-r pr-3 sm:pr-5 shrink-0 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-[5px] text-sm transition-colors cursor-pointer w-full text-left rounded-[8px]",
                  activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-gray-500 hover:text-foreground",
                )}
              >
                <Icon name={tab.iconName} size={16} className={activeTab === tab.id ? "text-foreground" : "text-secondary-foreground"} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 pr-2 sm:pr-5 pl-4 sm:pl-6 pt-1 min-w-0">
            {activeTab === "date" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">When</label>
                  <Input
                    type="date"
                    value={draft.dateFrom}
                    onChange={(e) => setDraft((p) => ({ ...p, dateFrom: e.target.value }))}
                    className="w-full h-10 rounded-full text-sm focus:ring-2 focus:ring-primary/20 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">To</label>
                  <Input
                    type="date"
                    value={draft.dateTo}
                    min={draft.dateFrom}
                    onChange={(e) => setDraft((p) => ({ ...p, dateTo: e.target.value }))}
                    className="w-full h-10 rounded-full text-sm focus:ring-2 focus:ring-primary/20 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                  />
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Status</p>
                <div className="space-y-2.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <Checkbox checked={draft.statuses.includes(opt.value)} onCheckedChange={() => toggleStatus(opt.value)} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
