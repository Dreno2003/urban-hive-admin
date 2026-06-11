import type { SpacesSummary, SpacesListResponse, Space, CreateSpaceInput, SpaceDetail } from "../types"
import type { SpaceFilters } from "../components/spaces-filter-popover"

const PAGE_SIZE = 10

const ALL_SPACES: Space[] = [
  { id: "00001", name: "AV Conference Room",   spaceType: "Office",   rate: "₦8,000/day",    availability: "Occupied",  availableDate: "May 5, 2026" },
  { id: "00002", name: "AV housing",           spaceType: "Shortlet", rate: "₦35,000/night", availability: "Available", availableDate: "May 5, 2026" },
  { id: "00003", name: "Private Office A",     spaceType: "Office",   rate: "₦15,000/day",   availability: "Available", availableDate: "Jun 1, 2026" },
  { id: "00004", name: "Boardroom 1",          spaceType: "Boardroom",rate: "₦25,000/day",   availability: "Occupied",  availableDate: "Jun 3, 2026" },
  { id: "00005", name: "Open Desk 1",          spaceType: "Hot desk", rate: "₦3,500/day",    availability: "Available", availableDate: "Jun 1, 2026" },
  { id: "00006", name: "Open Desk 2",          spaceType: "Hot desk", rate: "₦3,500/day",    availability: "Available", availableDate: "Jun 1, 2026" },
  { id: "00007", name: "Executive Suite",      spaceType: "Office",   rate: "₦40,000/day",   availability: "Occupied",  availableDate: "Jun 10, 2026" },
  { id: "00008", name: "Penthouse B",          spaceType: "Shortlet", rate: "₦80,000/night", availability: "Available", availableDate: "Jun 7, 2026" },
  { id: "00009", name: "Boardroom 2",          spaceType: "Boardroom",rate: "₦25,000/day",   availability: "Available", availableDate: "Jun 5, 2026" },
  { id: "00010", name: "Office Suite 2",       spaceType: "Office",   rate: "₦18,000/day",   availability: "Occupied",  availableDate: "Jun 8, 2026" },
]

export const spacesMockService = {
  getSummary: async (): Promise<SpacesSummary> => {
    const total = ALL_SPACES.length
    const booked = ALL_SPACES.filter(s => s.availability === "Occupied").length
    const available = total - booked

    return {
      totalSpaces: total,
      totalSpacesLabel: "+ 5 added today",
      totalBooked: booked,
      totalBookedLabel: "+20 from yesterday",
      totalAvailable: available,
      totalAvailableLabel: "+2 from yesterday",
      spaceBars: [
        { label: "Shortlets", total: 10, free: 2 },
        { label: "Offices",   total: 10, free: 2 },
        { label: "Boardrooms",total: 10, free: 2 },
      ],
    }
  },

  getSpaces: async (page = 1, filters?: SpaceFilters): Promise<SpacesListResponse> => {
    let spaces = [...ALL_SPACES]
    if (filters) {
      if (filters.statuses.length)
        spaces = spaces.filter(s => filters.statuses.includes(s.availability))
      if (filters.spaceTypes.length)
        spaces = spaces.filter(s => filters.spaceTypes.includes(s.spaceType))
      if (filters.dateFrom)
        spaces = spaces.filter(s => new Date(s.availableDate) >= new Date(filters.dateFrom))
      if (filters.dateTo)
        spaces = spaces.filter(s => new Date(s.availableDate) <= new Date(filters.dateTo))
    }
    const totalPages = Math.max(1, Math.ceil(spaces.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    return { spaces: spaces.slice(start, start + PAGE_SIZE), totalPages, currentPage: page }
  },

  createSpace: async (input: CreateSpaceInput): Promise<Space> => {
    await new Promise(r => setTimeout(r, 600))
    const new_space: Space = {
      id: String(ALL_SPACES.length + 1).padStart(5, "0"),
      name: input.name,
      spaceType: input.spaceType,
      rate: `${input.amount}/${input.rateType}`,
      availability: "Available",
      availableDate: "—",
    }
    ALL_SPACES.push(new_space)
    return new_space
  },

  getSpaceById: async (id: string): Promise<SpaceDetail | null> => {
    const space = ALL_SPACES.find(s => s.id === id)
    if (!space) return null

    return {
      ...space,
      location: space.id === "00002" ? "Wuse 2, Abuja" : "Central Area, Abuja",
      monthlyRate: "Daily/Night",
      amenities: ["Wi-Fi", "Air conditioning", "Washing machine", "Kitchen"],
      bedrooms: 2,
      bathrooms: 2,
      description: space.id === "00002" 
        ? "A premium fully-furnished studio apartment in the heart of Wuse 2. Ideal for business travellers needing a quiet, comfortable base with reliable power and fast internet."
        : "A premium fully-furnished space equipped with modern amenities.",
      images: [
        "/design/images/image1.png",
        "/design/images/image2.png",
        "/design/images/image3.png",
        "/design/images/image4.png",
        "/design/images/image5.png"
      ],
      video: "/design/video/video1.mp4",
      activity: [
        {
          id: "00001",
          bookedBy: "Frieda Odagboyi",
          dateBooked: "May 8, 2026",
          checkIn: "May 12, 2026",
          checkOut: "May 14, 2026",
          duration: "2 days",
          status: "Complete",
          feedback: "It was a wonderful place, everything looks the same as seen on the website, lovely!",
          report: "I had issues getting access through the backdoor which was faulty. It needs to be fixed, thanks."
        },
        {
          id: "00002",
          bookedBy: "James Matthew",
          dateBooked: "May 10, 2026",
          checkIn: "May 24, 2026",
          checkOut: "May 31, 2026",
          duration: "8 days",
          status: "Active",
          feedback: "",
          report: ""
        }
      ],
      activityTotalPages: 1,
      feedback: [
        {
          id: "00001",
          client: "Adaeze Okonkwo",
          comment: "It was a wonderful place, everything looks the same as seen on the website, lovely!"
        },
        {
          id: "00002",
          client: "Funmi Adeyemi",
          comment: "It was a wonderful place, everything looks the same as seen on the website, lovely!"
        }
      ],
      feedbackTotalPages: 1,
      reports: [
        {
          id: "00001",
          client: "Adaeze Okonkwo",
          space: "Conference Room",
          category: "Maintenance",
          date: "May 12, 2026",
          status: "Resolved"
        },
        {
          id: "00002",
          client: "Funmi Adeyemi",
          space: "Private Office A",
          category: "Safety",
          date: "May 24, 2026",
          status: "Pending"
        }
      ],
      reportsTotalPages: 1,
    }
  },
}
