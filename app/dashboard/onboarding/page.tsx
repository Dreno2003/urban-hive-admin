"use client"

import React from "react"
import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import OnboardingContent from "@/features/onboarding/components/onboarding-content"

export default function OnboardingPage() {
  return (
    <>
      <title>Onboarding Guide | Urban Hive Admin</title>
      <DashboardLayout>
        <OnboardingContent />
      </DashboardLayout>
    </>
  )
}
