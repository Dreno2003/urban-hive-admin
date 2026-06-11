export type ReportStatus = "resolved" | "pending" | "open"

export interface Report {
  id: string
  clientName: string
  space: string
  category: string
  title: string
  message: string
  date: string
  status: ReportStatus
}

export interface ReportsSummary {
  openReports: number
  openReportsTrend: string
  resolvedThisMonth: number
  resolvedAvgResolutionTime: string
  topIssuePercent: string
  topIssueLabel: string
}

export interface ReportsListResponse {
  reports: Report[]
  totalPages: number
  currentPage: number
  totalCount: number
}
