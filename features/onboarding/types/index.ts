export type GuideTheme = "blue" | "yellow" | "pink" | "green"

export interface OnboardingGuide {
  id: string
  title: string
  fileUrl: string
  theme: GuideTheme
  createdAt: string
}
