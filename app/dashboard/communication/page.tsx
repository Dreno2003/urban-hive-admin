"use client"

import React from "react"
import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { CommunicationContent } from "@/features/communication"

export default function CommunicationPage() {
  return (
    <>
      <title>Communication | Urban Hive Admin</title>
      <DashboardLayout>
        <CommunicationContent />
      </DashboardLayout>
    </>
  )
}
