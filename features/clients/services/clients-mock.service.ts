import type { ClientsSummary, ClientsListResponse, Client } from "../types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const YEARLY_DATA: Record<number, number[]> = {
  2020: [3, 5, 4, 6, 8, 5, 7, 9, 6, 10, 7, 4],
  2021: [5, 7, 6, 9, 11, 8, 10, 12, 9, 13, 10, 6],
  2022: [7, 9, 8, 12, 14, 10, 13, 15, 12, 16, 12, 8],
  2023: [9, 12, 11, 15, 18, 13, 16, 19, 15, 20, 15, 10],
  2024: [12, 15, 14, 19, 22, 17, 20, 24, 19, 25, 18, 12],
  2025: [15, 19, 18, 23, 27, 21, 25, 29, 23, 30, 22, 15],
  2026: [18, 22, 21, 28, 20, 16, 24, 30, 26, 34, 19, 8],
}

const ALL_CLIENTS: Client[] = [
  { id: "00001", name: "Adaeze Okonkwo", email: "adaezeokonkwo...", space: "Conference Room", status: "active",   joinedDate: "May 12, 2026" },
  { id: "00002", name: "Funmi Adeyemi",  email: "funmiadayemi@...", space: "Private Office A", status: "active",   joinedDate: "May 24, 2026" },
  { id: "00003", name: "Emeka Nwosu",    email: "emeka.nwosu@...",  space: "Open Desk 3",     status: "inactive", joinedDate: "Apr 10, 2026" },
  { id: "00004", name: "Tolu Badmus",    email: "tolu.badmus@...",  space: "Penthouse B",     status: "active",   joinedDate: "Jun 01, 2026" },
  { id: "00005", name: "Chidi Okafor",   email: "chidi.okafor@...", space: "Boardroom 1",     status: "active",   joinedDate: "Jun 05, 2026" },
  { id: "00006", name: "Ngozi Eze",      email: "ngozi.eze@...",    space: "Office Suite 2",  status: "inactive", joinedDate: "Mar 20, 2026" },
]

const PAGE_SIZE = 5

export const clientsMockService = {
  getSummary: async (year: number): Promise<ClientsSummary> => {
    const counts = YEARLY_DATA[year] ?? YEARLY_DATA[2026]
    const total = counts.reduce((a, b) => a + b, 0)
    return {
      newThisMonth: 20,
      newThisMonthLabel: "New clients this month (May)",
      newThisMonthTrend: "+ 16 more than April",
      activeThisMonth: 45,
      activeThisMonthLabel: "Active clients this month (May)",
      activeThisMonthTrend: "+9 from yesterday",
      clientsThisYear: total,
      currentYear: year,
      monthlyData: MONTHS.map((month, i) => ({ month, count: counts[i] })),
    }
  },

  getClients: async (page = 1): Promise<ClientsListResponse> => {
    const totalPages = Math.max(1, Math.ceil(ALL_CLIENTS.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    return {
      clients: ALL_CLIENTS.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: page,
      totalCount: ALL_CLIENTS.length,
    }
  },
}
