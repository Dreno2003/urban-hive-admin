export type GuideTheme = "blue" | "orange" | "purple" | "green"

export type GuideCategory =
  | "getting_started"
  | "account_setup"
  | "payments"
  | "compliance"
  | "other"

export interface OnboardingGuide {
  id: string
  title: string
  fileUrl: string
  theme?: GuideTheme
  category?: GuideCategory
  createdAt: string
}
