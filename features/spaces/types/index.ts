export type SpaceType = "Office" | "Shortlet" | "Boardroom" | "Hot desk"
export type SpaceAvailability = "Available" | "Occupied"
export type ActivityStatus = "Complete" | "Active" | "Cancelled"
export type ReportStatus = "Resolved" | "Pending"

export type Space = {
  id: string
  name: string
  spaceType: SpaceType
  rate: string
  availability: SpaceAvailability
  availableDate: string
}

export type SpaceActivity = {
  id: string
  bookedBy: string
  dateBooked: string
  checkIn: string
  checkOut: string
  duration: string
  status: ActivityStatus
  feedback: string
  report: string
}

export type SpaceFeedback = {
  id: string
  client: string
  comment: string
}

export type SpaceReport = {
  id: string
  client: string
  space: string
  category: string
  date: string
  status: ReportStatus
}

export type SpaceDetail = Space & {
  location: string
  monthlyRate: string
  amenities: string[]
  bedrooms: number
  bathrooms: number
  description: string
  images: string[]
  video: string | null
  activity: SpaceActivity[]
  activityTotalPages: number
  feedback: SpaceFeedback[]
  feedbackTotalPages: number
  reports: SpaceReport[]
  reportsTotalPages: number
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

export type CreateSpaceInput = {
  spaceType: SpaceType
  name: string
  location: string
  description: string
  bedrooms: number
  bathrooms: number
  rateType: string
  amount: string
  amenities: string[]
  rules: string
  images: (File | null)[]
  video: File | null
}
