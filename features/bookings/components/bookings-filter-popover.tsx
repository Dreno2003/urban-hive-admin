"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@/shared/components/ui/icon";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import type { Dictionary } from "@/i18n/get-dictionary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingFilters {
  statuses: string[];
  spaceTypes: string[];
  dateFrom: string;
  dateTo: string;
}

interface BookingsFilterPopoverProps {
  value: BookingFilters;
  onChange: (filters: BookingFilters) => void;
  dict?: Dictionary;
}

// ─── Constants & Helpers ───────────────────────────────────────────────────────

type FilterTab = "date" | "status" | "space";

function countActiveFilters(f: BookingFilters): number {
  let n = 0;
  if (f.statuses.length) n += f.statuses.length;
  if (f.spaceTypes.length) n += f.spaceTypes.length;
  if (f.dateFrom || f.dateTo) n += 1;
  return n;
}

const emptyFilters = (): BookingFilters => ({
  statuses: [],
  spaceTypes: [],
  dateFrom: "",
  dateTo: "",
});

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingsFilterPopover({
  value,
  onChange,
  dict,
}: BookingsFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("date");
  const [draft, setDraft] = useState<BookingFilters>(value);
  const isMobile = useIsMobile()
  const appliedCount = countActiveFilters(value);
  const draftCount = countActiveFilters(draft);

  const settingsDict = dict ? (dict as any).settings || {} : {};

  const STATUS_OPTIONS = useMemo(() => [
    { value: "paid", label: settingsDict.statusPaid || "Paid" },
    { value: 'pending', label: settingsDict.statusPending || "Pending" },
    { value: "completed", label: settingsDict.statusCompleted || "Completed" },
    { value: "cancelled", label: settingsDict.statusCancelled || "Cancelled" },
  ], [settingsDict]);

  const SPACE_OPTIONS = useMemo(() => [
    { value: "shortlet", label: settingsDict.typeShortlet || "Shortlet apartment" },
    { value: "office", label: settingsDict.typeOffice || "Office" },
    { value: "boardroom", label: settingsDict.typeBoardroom || "Boardroom" },
  ], [settingsDict]);

  const TABS = useMemo(() => [
    { id: "date" as FilterTab, label: settingsDict.filterDate || "Date", iconName: "calendar" as const },
    { id: "status" as FilterTab, label: settingsDict.filterStatus || "Status", iconName: "loader" as const },
    { id: "space" as FilterTab, label: settingsDict.tableSpace || "Space", iconName: "building2" as const },
  ], [settingsDict]);

  const handleOpen = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const toggleStatus = (v: string) =>
    setDraft((p) => ({
      ...p,
      statuses: p.statuses.includes(v)
        ? p.statuses.filter((s) => s !== v)
        : [...p.statuses, v],
    }));

  const toggleSpace = (v: string) =>
    setDraft((p) => ({
      ...p,
      spaceTypes: p.spaceTypes.includes(v)
        ? p.spaceTypes.filter((s) => s !== v)
        : [...p.spaceTypes, v],
    }));

  return (
    <Popover open={open} onOpenChange={handleOpen} >
      {/* ── Trigger ─────────────────────────────────────────────────────────── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-1.5 w-[104px] h-[36px] px-4 rounded-[32px] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
            appliedCount > 0
              ? "bg-primary/5 text-primary"
              : "bg-secondary text-foreground",
          )}
        >
          <Icon name="sort" size={16} className="text-secondary-foreground shrink-0" />
          {settingsDict.filterBookings || "Filter"}
          {appliedCount > 0 && (
            <span className="text-primary font-semibold">({appliedCount})</span>
          )}
          <Icon name="chevronDown" size={16} className="text-secondary-foreground ml-0.5" />
        </button>
      </PopoverTrigger>

      {/* ── Popover card — no border, soft shadow only ───────────────────────── */}
      <PopoverContent
        align={isMobile ? 'center' : 'end'}
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={isMobile ? 16 : 0}
        className="w-[calc(100vw-32px)] sm:w-[574px] px-4 sm:px-6 rounded-[24px] sm:rounded-[32px] shadow-2xl ring-0! border-0 outline-none bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex border-b items-center justify-between psx-5 py-2">
          <span className="text-base font-bold text-foreground">{settingsDict.filterBookings || "Filter"}</span>
          <div className="flex items-center gap-2">
            {/* Reset — outlined pill with very subtle border */}
            <Button
              type="button"
              size={'sm'}
              variant="secondary-outline"
              onClick={() => setDraft(emptyFilters())}
              className="rounded-full text-sm w-[71px] text-black"
            >
              {draftCount > 0 ? `${settingsDict.filterReset || "Reset"}(${draftCount})` : (settingsDict.filterReset || "Reset")}
            </Button>
            {/* Apply — solid primary pill */}
            <Button
              size={'sm'}
              type="button"
              onClick={handleApply}
              className="text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full px-4 py-1.5 transition-colors cursor-pointer"
            >
              {settingsDict.filterApply || "Apply filter(s)"}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="pt-2 flex pb-4">
          {/* ── Sidebar — no divider, just space ────────────────────────────── */}
          <div className="w-[100px] sm:w-[130px] space-y-3 border-r pr-3 sm:pr-5 shrink-0 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-[5px] text-sm transition-colors cursor-pointer w-full text-left rounded-[8px]",
                  activeTab === tab.id
                    ? "bg-secondary text-foreground font-medium"
                    : "text-gray-500 hover:text-foreground",
                )}
              >
                <Icon
                  name={tab.iconName}
                  size={16}
                  className={
                    activeTab === tab.id ? "text-foreground" : "text-secondary-foreground"
                  }
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Panel ────────────────────────────────────────────────────────── */}
          <div className="flex-1 pr-2 sm:pr-5 pl-4 sm:pl-6 pt-1 min-w-0">
            {/* Date */}
            {activeTab === "date" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Date range
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium">
                      {settingsDict.dateStart || "When"}
                    </label>
                    <Input
                      type="date"
                      value={draft.dateFrom}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, dateFrom: e.target.value }))
                      }
                      className="w-full h-10 rounded-full  text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-medium">
                      {settingsDict.dateEnd || "To"}
                    </label>
                    <Input
                      type="date"
                      value={draft.dateTo}
                      min={draft.dateFrom}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, dateTo: e.target.value }))
                      }
                      className="w-full h-10 rounded-full  text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {activeTab === "status" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{settingsDict.filterStatus || "Status"}</p>
                <div className="space-y-2.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <Checkbox
                        checked={draft.statuses.includes(opt.value)}
                        onCheckedChange={() => toggleStatus(opt.value)}
                      />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Space */}
            {activeTab === "space" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  {settingsDict.tableSpace || "Space type"}
                </p>
                <div className="space-y-2.5">
                  {SPACE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <Checkbox
                        checked={draft.spaceTypes.includes(opt.value)}
                        onCheckedChange={() => toggleSpace(opt.value)}
                      />
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
