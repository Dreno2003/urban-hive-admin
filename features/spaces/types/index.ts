export type SpaceType = "Office" | "Shortlet" | "Boardroom" | "Hot desk"
export type SpaceAvailability = "Available" | "Occupied"

export type Space = {
  id: string
  name: string
  spaceType: SpaceType
  rate: string
  availability: SpaceAvailability
  availableDate: string
}

export type SpaceTypeBar = {
  label: string
  total: number
  free: number
}

export type SpacesSummary = {
  totalSpaces: number
  totalSpacesLabel: string
  totalBooked: number
  totalBookedLabel: string
  totalAvailable: number
  totalAvailableLabel: string
  spaceBars: SpaceTypeBar[]
}

export type SpacesListResponse = {
  spaces: Space[]
  totalPages: number
  currentPage: number
}
