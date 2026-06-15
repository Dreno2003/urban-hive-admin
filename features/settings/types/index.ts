export type UserProfile = {
  firstName: string
  lastName: string
  email: string
  avatar: string // Base64 image data or URL
}

export type ChangePasswordData = {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export type Teammate = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar: string // Base64 image data or URL
  role: "Administrator" | "Manager" | "Staff"
  status: "Active" | "Inactive"
  dateJoined: string
}

export type TeammateActivityType =
  | "Cancellation"
  | "Booking"
  | "Check-in"
  | "Check-out"
  | "Payment"
  | "Modification"

export type TeammateActivity = {
  id: string
  activity: string
  activityType: TeammateActivityType
  date: string
  time: string
}

export type TeammateFilters = {
  role?: string
  search?: string
}

export type NotificationSettings = {
  newInquiryAlerts: boolean
  paymentConfirmations: boolean
  overdueWarnings: boolean
  dailyScheduleDigest: boolean
}