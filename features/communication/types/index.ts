export type CampaignCategory = "Newsletter" | "Announcement" | "Promo" | "Alert"
export type SendViaChannel = "Email only" | "SMS only" | "Push notification" | "All channels"

export interface Campaign {
  id: string
  title: string
  category: CampaignCategory
  description: string
  sendVia: SendViaChannel
  status: "live" | "draft"
  createdAt: string
}

export interface CampaignFilters {
  categories: CampaignCategory[]
  dateFrom: string
  dateTo: string
}
