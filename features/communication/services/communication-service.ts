import type { Campaign } from "../types"

// To match the mock design exactly, we have 15 live campaigns.
// With a page size of 2, this gives exactly Math.ceil(15/2) = 8 pages, matching pages 1 to 8 in the mockup.
const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    title: "What's buzzing at UrbanHive Hub — May 2026",
    category: "Newsletter",
    description: "Community highlights, member spotlight, upcoming events and a special renewal offer...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "camp_2",
    title: "What's buzzing at UrbanHive Hub — May 2026",
    category: "Newsletter",
    description: "Community highlights, member spotlight, upcoming events and a special renewal offer...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-09T09:30:00Z",
  },
  {
    id: "camp_3",
    title: "Urban Hive Coworking Space Re-opening Announcement",
    category: "Announcement",
    description: "We are excited to reopen our main wing with upgraded high-speed fiber internet and new standing desks...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-08T08:15:00Z",
  },
  {
    id: "camp_4",
    title: "Exclusive Summer Promo: Get 20% off all meeting rooms",
    category: "Promo",
    description: "Book any meeting room during the summer months and enjoy an instant 20% discount on checkout...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-07T14:20:00Z",
  },
  {
    id: "camp_5",
    title: "Urgent Maintenance Notice: Elevator Upgrades",
    category: "Alert",
    description: "Please be informed that elevators in Wing A will be undergoing routine maintenance on Saturday...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-06T11:00:00Z",
  },
  {
    id: "camp_6",
    title: "Introducing Our New Café Partner: Bean & Brew",
    category: "Newsletter",
    description: "Starting this Monday, check out Bean & Brew at the lobby for special artisan coffee and member discounts...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-05T09:00:00Z",
  },
  {
    id: "camp_7",
    title: "Refer a friend, get free desk space for a week!",
    category: "Promo",
    description: "Spread the word about Urban Hive! For every colleague who signs up for a month, you get a week free...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-04T16:00:00Z",
  },
  {
    id: "camp_8",
    title: "Welcome to our new onboarding portal",
    category: "Announcement",
    description: "We have launched a brand new guide to help new members navigate workspace rules and get started...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-03T10:30:00Z",
  },
  {
    id: "camp_9",
    title: "Weekly Community Roundup - June 2026",
    category: "Newsletter",
    description: "Catch up on what happened this week at the main hub, including the Friday happy hour summary...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-02T17:00:00Z",
  },
  {
    id: "camp_10",
    title: "Upcoming Fire Drill Notice - Wing B",
    category: "Alert",
    description: "A routine fire drill is scheduled for Wednesday at 10:00 AM. Please follow floor warden instructions...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "camp_11",
    title: "Discount on Dedicated Desks for Teams of 5+",
    category: "Promo",
    description: "Get a custom group discount when onboarding your team to our dedicated desk plans. Contact support today...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-04-30T11:45:00Z",
  },
  {
    id: "camp_12",
    title: "Urban Hive App v2.4 Launch & Features",
    category: "Announcement",
    description: "Download the latest version of the app to access contactless entry keys and instant meeting room bookings...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-04-29T12:00:00Z",
  },
  {
    id: "camp_13",
    title: "Community Yoga Session: Monday Morning",
    category: "Newsletter",
    description: "Join us in the rooftop garden at 7:30 AM for a guided yoga session. Free smoothies for all attendees...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-04-28T07:15:00Z",
  },
  {
    id: "camp_14",
    title: "Eco-Friendly Initiative: Rooftop Gardening",
    category: "Announcement",
    description: "We are starting a voluntary community rooftop garden. Help plant herbs, vegetables, and flowers...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-04-27T14:00:00Z",
  },
  {
    id: "camp_15",
    title: "Tech Talk Tuesday: Modern Frontend Development",
    category: "Newsletter",
    description: "Join us in the lounge as we review the future of Next.js, React 19, and TailwindCSS v4 with local experts...",
    sendVia: "Email only",
    status: "live",
    createdAt: "2026-04-26T15:30:00Z",
  },
  // Drafts
  {
    id: "camp_draft_1",
    title: "Draft: Welcome newsletter for new corporate clients",
    category: "Newsletter",
    description: "Welcome to Urban Hive! This guide will run through how you can configure seat allocations...",
    sendVia: "SMS only",
    status: "draft",
    createdAt: "2026-06-12T10:00:00Z",
  },
  {
    id: "camp_draft_2",
    title: "Draft: Scheduled maintenance for parking lot resurfacing",
    category: "Alert",
    description: "The main parking area will be resurfaced this coming weekend. Please park in the auxiliary lot...",
    sendVia: "Email only",
    status: "draft",
    createdAt: "2026-06-11T16:00:00Z",
  },
  {
    id: "camp_draft_3",
    title: "Draft: Referral Program Update 2026",
    category: "Promo",
    description: "Earn rewards by referring companies to our private offices and dedicated desks...",
    sendVia: "Email only",
    status: "draft",
    createdAt: "2026-06-10T12:00:00Z",
  },
]

const LOCAL_STORAGE_KEY = "urban_hive_campaigns"

export const communicationService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    // Simulating API network latency
    // return []
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return DEFAULT_CAMPAIGNS
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS))
      return DEFAULT_CAMPAIGNS
    }

    try {
      return JSON.parse(stored) as Campaign[]
    } catch {
      return DEFAULT_CAMPAIGNS
    }
  },

  saveCampaign: async (campaign: Omit<Campaign, "id" | "createdAt"> & { id?: string }): Promise<Campaign> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      const fullCampaign: Campaign = {
        id: campaign.id || `camp_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...campaign,
      }
      return fullCampaign
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    const campaigns: Campaign[] = stored ? JSON.parse(stored) : DEFAULT_CAMPAIGNS

    let finalCampaign: Campaign

    if (campaign.id) {
      const index = campaigns.findIndex((c) => c.id === campaign.id)
      if (index > -1) {
        finalCampaign = {
          ...campaigns[index],
          ...campaign,
          id: campaign.id,
        }
        campaigns[index] = finalCampaign
      } else {
        finalCampaign = {
          id: campaign.id,
          createdAt: new Date().toISOString(),
          ...campaign,
        }
        campaigns.push(finalCampaign)
      }
    } else {
      finalCampaign = {
        id: `camp_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...campaign,
      }
      campaigns.unshift(finalCampaign) // Add to the top
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns))
    return finalCampaign
  },

  deleteCampaign: async (id: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return id
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    let campaigns: Campaign[] = stored ? JSON.parse(stored) : DEFAULT_CAMPAIGNS

    campaigns = campaigns.filter((c) => c.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns))
    return id
  },
}
