"use client"

import { useState } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { Pagination } from "@/shared/components/ui/pagination"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/components/ui/badge"
import { useReportsSummary, useReportsList } from "../hooks/use-reports"
import { ReportDetailsDialog } from "./report-details-dialog"
import { RespondReportDialog } from "./respond-report-dialog"
import type { Report } from "../types"

const COLS = ["ID", "Client", "Space", "Category", "Date", "Status", "Action"]
const WIDTHS = ["w-[8%]", "w-[18%]", "w-[16%]", "w-[14%]", "w-[14%]", "w-[14%]", "w-[10%]"]

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary"> = {
  resolved: "success",
  pending:  "warning",
  open:     "secondary",
}

const STATUS_ICON: Record<string, "check" | "loader" | "flag"> = {
  resolved: "check",
  pending:  "loader",
  open:     "flag",
}

export function ReportsContent() {
  const [page, setPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [respondReport, setRespondReport] = useState<Report | null>(null)
  const { data: summary, isLoading: summaryLoading } = useReportsSummary()
  const { data: list, isLoading: listLoading } = useReportsList(page)

  
  const reports = list?.reports ?? []
  const totalPages = list?.totalPages ?? 1

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All confirmed, pending, and past bookings.</p>
          </div>
          <Button variant="secondary-outline" className="rounded-full h-[42px] px-5 text-sm font-medium gap-2">
            <Icon name="exportSquareOutline" size={15} />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <InsetCard title="Open reports" className="bg-gray-100 border border-gray-100" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.openReports ?? 0} trend={summary?.openReportsTrend} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard title="Reports resolved (May)" className="bg-secondary border border-gray-100" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.resolvedThisMonth ?? 0} trend={summary?.resolvedAvgResolutionTime} trendType="neutral" />
            )}
          </InsetCard>

          <InsetCard title="Top issue (May)" className="bg-secondary border border-gray-100" insetClassName="bg-white">
            {summaryLoading ? (
              <div className="flex flex-col gap-2"><Skeleton className="h-9 w-12 bg-gray-200" /><Skeleton className="h-4 w-28 bg-gray-200" /></div>
            ) : (
              <InsetCard.Metric value={summary?.topIssuePercent ?? "0%"} trend={summary?.topIssueLabel} trendType="neutral" />
            )}
          </InsetCard>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-[28px]">
          <div className="flex items-center justify-between px-6 py-4">
            <h4 className="text-[17px] font-bold tracking-tight">Report</h4>
            <Button
              type="button"
              variant={'secondary-outline'}
              className="rounded-full px-4 h-[36px]"

              // className="flex items-center gap-1.5  px-4 rounded-[32px] text-sm font-medium bg-secondary text-foreground"
            >
              <Icon name="sort" size={16} className="text-secondary-foreground shrink-0" />
              Filter
              <Icon name="chevronDown" size={16} className="text-secondary-foreground ml-0.5" />
            </Button>
          </div>

          <div className="flex items-center bg-secondary px-6 py-3.5 border-y border-gray-100">
            {COLS.map((col, i) => (
              <span key={col} className={cn("text-[12.5px] font-semibold tracking-wide", WIDTHS[i])}>{col}</span>
            ))}
          </div>

          <div className="flex flex-col divide-y divide-gray-50">
            {listLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-5 gap-2 animate-pulse">
                  {WIDTHS.map((w, j) => <Skeleton key={j} className={cn("h-4 bg-gray-100", w)} />)}
                </div>
              ))
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Icon name="flagFill" className="size-[79px] text-secondary-foreground" />
                <p className="text-body-lg font-bold ">No reports</p>
                <p className="text-sm text-secondary-foreground">No report has been made yet</p>
              </div>
            ) : (
              reports.map((report: Report, idx) => (
                <div
                  key={report.id}
                  className={cn(
                    "flex items-center px-6 py-5  transition-colors",
                    idx === reports.length - 1 && "rounded-b-[28px]"
                  )}
                >
                  <span className={cn("text-[13px] text-secondary-foreground font-mono", WIDTHS[0])}>{report.id}</span>
                  <span className={cn("text-[13px] text-secondary-foreground truncate pr-3", WIDTHS[1])}>{report.clientName}</span>
                  <span className={cn("text-[13px] text-secondary-foreground truncate pr-3", WIDTHS[2])}>{report.space}</span>
                  <span className={cn("text-[13px] text-secondary-foreground", WIDTHS[3])}>{report.category}</span>
                  <span className={cn("text-[13px] text-secondary-foreground", WIDTHS[4])}>{report.date}</span>
                  <div className={WIDTHS[5]}>
                    <Badge variant={STATUS_VARIANT[report.status] ?? "secondary"} iconName={STATUS_ICON[report.status]} className="capitalize">
                      {report.status}
                    </Badge>
                  </div>
                  <span className={cn("text-[13px] text-primary font-medium hover:underline cursor-pointer", WIDTHS[6])} onClick={() => setSelectedReport(report)}>View</span>
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

      <ReportDetailsDialog
        report={selectedReport}
        open={!!selectedReport}
        onOpenChange={(open) => { if (!open) setSelectedReport(null) }}
        onRespond={(report) => {
          setSelectedReport(null)
          setRespondReport(report)
        }}
      />

      <RespondReportDialog
        report={respondReport}
        open={!!respondReport}
        onOpenChange={(open) => { if (!open) setRespondReport(null) }}
        onBack={() => {
          setRespondReport(null)
          setSelectedReport(respondReport)
        }}
      />
    </div>
  )
}
