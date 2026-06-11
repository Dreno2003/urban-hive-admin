import type { SpacesSummary, SpacesListResponse, Space, CreateSpaceInput } from "../types"

const PAGE_SIZE = 10

const ALL_SPACES: Space[] = [
  { id: "00001", name: "AV Conference Room",   spaceType: "Office",   rate: "₦8,000/day",    availability: "Occupied",  availableDate: "May 5, 2026" },
  { id: "00002", name: "Holly's Apartments",   spaceType: "Shortlet", rate: "₦20,000/night", availability: "Available", availableDate: "May 5, 2026" },
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

  getSpaces: async (page = 1): Promise<SpacesListResponse> => {
    const totalPages = Math.max(1, Math.ceil(ALL_SPACES.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    return {
      spaces: ALL_SPACES.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: page,
    }
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
}
