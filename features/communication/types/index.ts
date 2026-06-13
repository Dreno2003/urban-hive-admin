export type CampaignCategory = "Newsletter" | "Announcement" | "Promo" | "Alert"

export interface Campaign {
  id: string
  title: string
  category: CampaignCategory
  description: string
  audience: string
  status: "live" | "draft"
  createdAt: string
}

export interface CampaignFilters {
  categories: CampaignCategory[]
  dateFrom: string
  dateTo: string
}
