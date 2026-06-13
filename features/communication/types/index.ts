export type CampaignCategory = "Newsletter" | "Promotional offer" | "Holiday message" | "Satisfaction survey"
export type SendViaChannel = "Email only" | "Whatsapp only" | "Email and whatsapp"

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
