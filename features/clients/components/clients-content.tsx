"use client"

import React, { useRef, useState } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { Pagination } from "@/shared/components/ui/pagination"
import { BookingsBarChart } from "@/features/bookings/components/bookings-bar-chart"
import { useClientsSummary, useClientsList } from "../hooks/use-clients"
import { ChevronDown, UserRound } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { Client } from "../types"

const CURRENT_YEAR = new Date().getFullYear()
const AVAILABLE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

const COLS = ["ID", "Client", "Email", "Space", "Status", "Joined date", "Action"]
const WIDTHS = ["w-[8%]", "w-[18%]", "w-[18%]", "w-[18%]", "w-[12%]", "w-[16%]", "w-[10%]"]

export function ClientsContent() {
  const [page, setPage] = useState(1)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: summary, isLoading: summaryLoading } = useClientsSummary(selectedYear)
  const { data: list, isLoading: listLoading } = useClientsList(page)

  const clients = list?.clients ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-8 md:px-12 pt-8 pb-12 mt-[76px]">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">Clients</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All active users of Urban Hive</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary-outline" className="rounded-full h-[42px] px-5 text-sm font-medium gap-2">
              <Icon name="download" size={15} />
              Export CSV
            </Button>
            <Button className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2">
              <Icon name="plus" size={15} />
              Add client
            </Button>
          </div>
        </div>

        {/* ── Summary Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <InsetCard title={summary?.newThisMonthLabel ?? "New clients this month"} className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.newThisMonth ?? 0} trend={summary?.newThisMonthTrend} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard title={summary?.activeThisMonthLabel ?? "Active clients this month"} className="bg-[#F2F2F7]" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.activeThisMonth ?? 0} trend={summary?.activeThisMonthTrend} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard
            className="bg-[#F2F2F7]"
            insetClassName="bg-white"
            title={
              summaryLoading
                ? <Skeleton className="h-4 w-36 bg-gray-200" />
                : <span className="text-[15px] font-medium text-secondary-foreground">{summary?.clientsThisYear ?? 0} clients this year</span>
            }
            headerExtra={
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setYearDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
                >
                  {selectedYear}
                  <ChevronDown className={cn("size-4 transition-transform duration-150", yearDropdownOpen && "rotate-180")} />
                </button>
                {yearDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[90px]">
                    {AVAILABLE_YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); setYearDropdownOpen(false) }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                          year === selectedYear ? "font-semibold text-primary" : "text-gray-700"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          >
            {summaryLoading
              ? <Skeleton className="h-[90px] w-full bg-gray-200 rounded-xl" />
              : <BookingsBarChart data={summary?.monthlyData ?? []} />
            }
          </InsetCard>
        </div>

        {/* ── Clients Table ────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">All clients</h4>
            <Button variant="secondary-outline" size="sm" className="rounded-full h-[34px] px-4 gap-2 text-[13px]">
              <Icon name="sliders" size={14} />
              Filter
              <ChevronDown className="size-3.5" />
            </Button>
          </div>

          {/* Column headers */}
          <div className="flex items-center bg-secondary px-6 py-3.5 border-y border-gray-100 dark:border-gray-800">
            {COLS.map((col, i) => (
              <span key={col} className={cn("text-[12.5px] font-semibold text-gray-500 tracking-wide", WIDTHS[i])}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-gray-50 dark:divide-gray-800/40">
            {listLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-5 gap-2 animate-pulse">
                  {WIDTHS.map((w, j) => <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />)}
                </div>
              ))
            ) : clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="size-[72px] rounded-2xl bg-gray-100 flex items-center justify-center">
                  <UserRound className="size-9 text-gray-400" />
                </div>
                <p className="text-[16px] font-semibold text-gray-900">No clients</p>
                <p className="text-sm text-gray-400">No client has been added yet</p>
              </div>
            ) : (
              clients.map((client, idx) => (
                <div
                  key={client.id}
                  className={cn(
                    "flex items-center px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer",
                    idx === clients.length - 1 && "rounded-b-[28px]"
                  )}
                >
                  <span className={cn("text-[13px] text-gray-500 font-mono", WIDTHS[0])}>{client.id}</span>
                  <span className={cn("text-[14px] font-medium text-gray-900 truncate pr-3", WIDTHS[1])}>{client.name}</span>
                  <span className={cn("text-[13px] text-gray-500 truncate pr-3", WIDTHS[2])}>{client.email}</span>
                  <span className={cn("text-[13px] text-gray-500 truncate pr-3", WIDTHS[3])}>{client.space}</span>
                  <div className={cn(WIDTHS[4])}>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium",
                      client.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      <span className={cn("size-1.5 rounded-full shrink-0", client.status === "active" ? "bg-green-500" : "bg-gray-400")} />
                      {client.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <span className={cn("text-[13px] text-gray-500", WIDTHS[5])}>{client.joinedDate}</span>
                  <span className={cn("text-[13px] text-primary font-medium hover:underline cursor-pointer", WIDTHS[6])}>View profile</span>
                </div>
              ))
            )}
          </div>

          <Separator />
          {!listLoading && totalPages > 1 && (
            <div className="px-6 pb-2">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
