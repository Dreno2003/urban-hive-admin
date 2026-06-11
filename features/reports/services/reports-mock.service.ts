import type { ReportsSummary, ReportsListResponse, Report } from "../types"

const ALL_REPORTS: Report[] = [
  { id: "00001", clientName: "Adaeze Okonkwo", space: "Conference Room",  category: "Maintenance", title: "The house is bad",         message: "The house is bad and needs urgent attention.",          date: "May 12, 2026", status: "resolved" },
  { id: "00002", clientName: "Funmi Adeyemi",  space: "Private Office A", category: "Safety",      title: "Broken fire exit",         message: "The fire exit door is jammed and cannot be opened.",    date: "May 24, 2026", status: "pending"  },
  { id: "00003", clientName: "Emeka Nwosu",    space: "Open Desk 3",      category: "Maintenance", title: "Leaking ceiling",          message: "Water is dripping from the ceiling near desk 3.",       date: "Apr 10, 2026", status: "open"     },
  { id: "00004", clientName: "Tolu Badmus",    space: "Penthouse B",      category: "Noise",       title: "Excessive noise at night", message: "Loud music from the floor above every night after 10pm.", date: "Jun 01, 2026", status: "resolved" },
  { id: "00005", clientName: "Chidi Okafor",   space: "Boardroom 1",      category: "Safety",      title: "Exposed wiring",           message: "There is exposed electrical wiring near the projector.", date: "Jun 05, 2026", status: "pending"  },
  { id: "00006", clientName: "Ngozi Eze",      space: "Office Suite 2",   category: "Maintenance", title: "AC not working",           message: "The air conditioning unit has stopped working.",         date: "Mar 20, 2026", status: "open"     },
]

const PAGE_SIZE = 5

export const reportsMockService = {
  getSummary: async (): Promise<ReportsSummary> => ({
    openReports: 5,
    openReportsTrend: "1 Up from 2 last week",
    resolvedThisMonth: 11,
    resolvedAvgResolutionTime: "Avg resolution time: 3.2 hrs",
    topIssuePercent: "38%",
    topIssueLabel: "Reports flagged as maintenance",
  }),

  getReports: async (page = 1): Promise<ReportsListResponse> => {
    const totalPages = Math.max(1, Math.ceil(ALL_REPORTS.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    return {
      reports: ALL_REPORTS.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: page,
      totalCount: ALL_REPORTS.length,
    }
  },
}
