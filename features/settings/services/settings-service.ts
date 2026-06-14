import type { UserProfile, Teammate, TeammateFilters, TeammateActivity, TeammateActivityType } from "../types"

const PROFILE_STORAGE_KEY = "urban_hive_profile"
const PASSWORD_STORAGE_KEY = "urban_hive_password"
const TEAMMATES_STORAGE_KEY = "urban_hive_teammates"

const DEFAULT_PROFILE: UserProfile = {
  firstName: "Frieda",
  lastName: "Odagboyi",
  email: "friedaodagboyi@gmail.com",
  avatar: "",
}

const DEFAULT_PASSWORD = "password123"

const DEFAULT_TEAMMATES: Teammate[] = [
  {
    id: "00001",
    firstName: "Frieda",
    lastName: "Ops",
    email: "frieda@urbanhivehub.com",
    avatar: "",
    role: "Administrator",
    status: "Active",
    dateJoined: "Aug 18, 2025 9:45 AM",
  },
  {
    id: "00002",
    firstName: "Taiwo",
    lastName: "James",
    email: "taiwo@urbanhivehub.com",
    phone: "+234 9138407481",
    avatar: "",
    role: "Manager",
    status: "Active",
    dateJoined: "Aug 18, 2025 9:45 AM",
  },
  {
    id: "00003",
    firstName: "Alex",
    lastName: "Reed",
    email: "alex.reed@urbanhivehub.com",
    avatar: "",
    role: "Manager",
    status: "Active",
    dateJoined: "Sep 01, 2025 10:30 AM",
  },
  {
    id: "00004",
    firstName: "Jessica",
    lastName: "Chen",
    email: "jessica.c@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Sep 10, 2025 2:15 PM",
  },
  {
    id: "00005",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Oct 05, 2025 9:00 AM",
  },
  {
    id: "00006",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.j@urbanhivehub.com",
    avatar: "",
    role: "Manager",
    status: "Active",
    dateJoined: "Oct 12, 2025 11:15 AM",
  },
  {
    id: "00007",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.b@urbanhivehub.com",
    avatar: "",
    role: "Administrator",
    status: "Active",
    dateJoined: "Nov 01, 2025 8:30 AM",
  },
  {
    id: "00008",
    firstName: "Emily",
    lastName: "Watson",
    email: "emily.w@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Nov 15, 2025 4:00 PM",
  },
  {
    id: "00009",
    firstName: "David",
    lastName: "Miller",
    email: "david.m@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Dec 03, 2025 10:00 AM",
  },
  {
    id: "00010",
    firstName: "Lisa",
    lastName: "Thorne",
    email: "lisa.t@urbanhivehub.com",
    avatar: "",
    role: "Manager",
    status: "Active",
    dateJoined: "Dec 20, 2025 1:45 PM",
  },
  {
    id: "00011",
    firstName: "James",
    lastName: "Wilson",
    email: "james.w@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Jan 10, 2026 9:15 AM",
  },
  {
    id: "00012",
    firstName: "Patricia",
    lastName: "Taylor",
    email: "patricia.t@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Jan 25, 2026 3:30 PM",
  },
  {
    id: "00013",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@urbanhivehub.com",
    avatar: "",
    role: "Administrator",
    status: "Active",
    dateJoined: "Feb 05, 2026 11:00 AM",
  },
  {
    id: "00014",
    firstName: "Linda",
    lastName: "Davies",
    email: "linda.d@urbanhivehub.com",
    avatar: "",
    role: "Manager",
    status: "Active",
    dateJoined: "Feb 18, 2026 2:30 PM",
  },
  {
    id: "00015",
    firstName: "William",
    lastName: "Smith",
    email: "william.s@urbanhivehub.com",
    avatar: "",
    role: "Staff",
    status: "Active",
    dateJoined: "Mar 02, 2026 10:15 AM",
  },
]

const ACTIVITY_LOG_PER_PAGE = 2

const MOCK_ACTIVITIES: Record<string, TeammateActivity[]> = {
  default: [
    {
      id: "act-001",
      activity: "Cancelled booking #10002",
      activityType: "Cancellation",
      date: "May 12, 2026",
      time: "1:00 PM",
    },
    {
      id: "act-002",
      activity: "Cancelled booking #10002",
      activityType: "Cancellation",
      date: "May 24, 2026",
      time: "1:02 PM",
    },
    {
      id: "act-003",
      activity: "Created booking #10035",
      activityType: "Booking",
      date: "Apr 30, 2026",
      time: "10:15 AM",
    },
    {
      id: "act-004",
      activity: "Checked in guest #G5012",
      activityType: "Check-in",
      date: "Apr 28, 2026",
      time: "9:00 AM",
    },
    {
      id: "act-005",
      activity: "Processed payment #P3020",
      activityType: "Payment",
      date: "Apr 25, 2026",
      time: "3:45 PM",
    },
    {
      id: "act-006",
      activity: "Modified booking #10018",
      activityType: "Modification",
      date: "Apr 22, 2026",
      time: "11:30 AM",
    },
    {
      id: "act-007",
      activity: "Checked out guest #G4901",
      activityType: "Check-out",
      date: "Apr 20, 2026",
      time: "12:00 PM",
    },
    {
      id: "act-008",
      activity: "Created booking #10041",
      activityType: "Booking",
      date: "Apr 18, 2026",
      time: "2:10 PM",
    },
  ],
}

const PAGE_SIZE = 2

const formatDate = (date: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const m = months[date.getMonth()]
  const d = date.getDate()
  const y = date.getFullYear()
  let hrs = date.getHours()
  const mins = String(date.getMinutes()).padStart(2, "0")
  const ampm = hrs >= 12 ? "PM" : "AM"
  hrs = hrs % 12
  hrs = hrs ? hrs : 12
  return `${m} ${d}, ${y} ${hrs}:${mins} ${ampm}`
}

export const settingsService = {
  getProfile: async (): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return DEFAULT_PROFILE
    }

    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE))
      return DEFAULT_PROFILE
    }

    try {
      return JSON.parse(stored) as UserProfile
    } catch {
      return DEFAULT_PROFILE
    }
  },

  updateProfile: async (profile: UserProfile): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    }
    return profile
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return
    }

    const storedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD

    if (currentPassword !== storedPassword) {
      throw new Error("The current password you entered is incorrect.")
    }

    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword)
  },

  getTeammates: async (
    page = 1,
    filters?: TeammateFilters
  ): Promise<{ teammates: Teammate[]; totalPages: number; totalCount: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return { teammates: DEFAULT_TEAMMATES.slice(0, PAGE_SIZE), totalPages: 8, totalCount: 15 }
    }

    let teammates: Teammate[] = []
    const stored = localStorage.getItem(TEAMMATES_STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(TEAMMATES_STORAGE_KEY, JSON.stringify(DEFAULT_TEAMMATES))
      teammates = DEFAULT_TEAMMATES
    } else {
      try {
        teammates = JSON.parse(stored) as Teammate[]
      } catch {
        teammates = DEFAULT_TEAMMATES
      }
    }

    // Apply filtering
    let filtered = [...teammates]
    if (filters) {
      if (filters.role && filters.role !== "All") {
        filtered = filtered.filter(
          (t) => t.role.toLowerCase() === filters.role?.toLowerCase()
        )
      }
      if (filters.search) {
        const query = filters.search.toLowerCase().trim()
        filtered = filtered.filter(
          (t) =>
            t.firstName.toLowerCase().includes(query) ||
            t.lastName.toLowerCase().includes(query) ||
            t.email.toLowerCase().includes(query)
        )
      }
    }

    const totalCount = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    const paginated = filtered.slice(start, start + PAGE_SIZE)

    return {
      teammates: paginated,
      totalPages,
      totalCount,
    }
  },

  getTeammateById: async (id: string): Promise<Teammate | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    if (typeof window === "undefined") {
      return DEFAULT_TEAMMATES.find((t) => t.id === id) ?? null
    }

    let teammates: Teammate[] = []
    const stored = localStorage.getItem(TEAMMATES_STORAGE_KEY)
    if (stored) {
      try {
        teammates = JSON.parse(stored) as Teammate[]
      } catch {
        teammates = DEFAULT_TEAMMATES
      }
    } else {
      teammates = DEFAULT_TEAMMATES
    }

    return teammates.find((t) => t.id === id) ?? null
  },

  inviteTeammate: async (teammate: Omit<Teammate, "id" | "avatar" | "status" | "dateJoined">): Promise<Teammate> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      const mock: Teammate = {
        id: "99999",
        avatar: "",
        status: "Active",
        dateJoined: formatDate(new Date()),
        ...teammate,
      }
      return mock
    }

    let teammates: Teammate[] = []
    const stored = localStorage.getItem(TEAMMATES_STORAGE_KEY)
    if (stored) {
      try {
        teammates = JSON.parse(stored) as Teammate[]
      } catch {
        teammates = [...DEFAULT_TEAMMATES]
      }
    } else {
      teammates = [...DEFAULT_TEAMMATES]
    }

    // Create unique numeric ID padded to 5 digits based on previous numeric IDs
    const numericIds = teammates.map((t) => parseInt(t.id)).filter((id) => !isNaN(id))
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0
    const nextIdStr = String(maxId + 1).padStart(5, "0")

    const newTeammate: Teammate = {
      id: nextIdStr,
      avatar: "",
      status: "Active",
      dateJoined: formatDate(new Date()),
      ...teammate,
    }

    // Prepend so it appears first
    teammates.unshift(newTeammate)
    localStorage.setItem(TEAMMATES_STORAGE_KEY, JSON.stringify(teammates))
    return newTeammate
  },

  getTeammateActivity: async (
    teammateId: string,
    page = 1,
    typeFilter?: string
  ): Promise<{ activities: TeammateActivity[]; totalPages: number; totalCount: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const all = MOCK_ACTIVITIES.default ?? []

    let filtered = [...all]
    if (typeFilter && typeFilter !== "All") {
      filtered = filtered.filter((a) => a.activityType === typeFilter)
    }

    const totalCount = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalCount / ACTIVITY_LOG_PER_PAGE))
    const start = (page - 1) * ACTIVITY_LOG_PER_PAGE
    const paginated = filtered.slice(start, start + ACTIVITY_LOG_PER_PAGE)

    return { activities: paginated, totalPages, totalCount }
  },

  suspendTeammate: async (teammateId: string): Promise<Teammate> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      throw new Error("Cannot suspend teammate on server")
    }

    let teammates: Teammate[] = []
    const stored = localStorage.getItem(TEAMMATES_STORAGE_KEY)
    if (stored) {
      try {
        teammates = JSON.parse(stored) as Teammate[]
      } catch {
        teammates = [...DEFAULT_TEAMMATES]
      }
    } else {
      teammates = [...DEFAULT_TEAMMATES]
    }

    const idx = teammates.findIndex((t) => t.id === teammateId)
    if (idx === -1) throw new Error("Teammate not found")

    teammates[idx] = {
      ...teammates[idx],
      status: teammates[idx].status === "Active" ? "Inactive" : "Active",
    }

    localStorage.setItem(TEAMMATES_STORAGE_KEY, JSON.stringify(teammates))
    return teammates[idx]
  },

  removeTeammate: async (teammateId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") return

    let teammates: Teammate[] = []
    const stored = localStorage.getItem(TEAMMATES_STORAGE_KEY)
    if (stored) {
      try {
        teammates = JSON.parse(stored) as Teammate[]
      } catch {
        teammates = [...DEFAULT_TEAMMATES]
      }
    } else {
      teammates = [...DEFAULT_TEAMMATES]
    }

    teammates = teammates.filter((t) => t.id !== teammateId)
    localStorage.setItem(TEAMMATES_STORAGE_KEY, JSON.stringify(teammates))
  },
}
