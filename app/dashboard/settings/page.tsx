"use client"

import React from "react"
import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { SettingsContent } from "@/features/settings"

export default function SettingsPage() {
  return (
    <>
      <title>Settings | Urban Hive Admin</title>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </>
  )
}
