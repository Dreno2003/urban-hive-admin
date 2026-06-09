import { OnboardingGuide } from "../types"

const DEFAULT_GUIDES: OnboardingGuide[] = [
  {
    id: "1",
    title: "Manually onboarding a client",
    fileUrl: "https://docs.google.com/document/d/example1",
    category: "getting_started",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Cancellation steps",
    fileUrl: "https://docs.google.com/document/d/example2",
    category: "account_setup",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Complaints procedure",
    fileUrl: "https://docs.google.com/document/d/example3",
    category: "compliance",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Fraud detection",
    fileUrl: "https://docs.google.com/document/d/example4",
    category: "other",
    createdAt: new Date().toISOString(),
  },
]

const LOCAL_STORAGE_KEY = "urban_hive_onboarding_guides"

export const onboardingService = {
  getGuides: async (): Promise<OnboardingGuide[]> => {
    // Simulating API network latency
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return DEFAULT_GUIDES
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GUIDES))
      return DEFAULT_GUIDES
    }

    try {
      return JSON.parse(stored) as OnboardingGuide[]
    } catch {
      return DEFAULT_GUIDES
    }
  },

  saveGuide: async (guide: OnboardingGuide): Promise<OnboardingGuide> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return guide
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    const guides: OnboardingGuide[] = stored ? JSON.parse(stored) : DEFAULT_GUIDES

    const index = guides.findIndex((g) => g.id === guide.id)
    if (index > -1) {
      guides[index] = { ...guide, createdAt: guides[index].createdAt }
    } else {
      guides.push(guide)
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guides))
    return guide
  },

  deleteGuide: async (id: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (typeof window === "undefined") {
      return id
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    let guides: OnboardingGuide[] = stored ? JSON.parse(stored) : DEFAULT_GUIDES

    guides = guides.filter((g) => g.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guides))
    return id
  },
}
