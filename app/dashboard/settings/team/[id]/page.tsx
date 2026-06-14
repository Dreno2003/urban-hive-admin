"use client"

import { use } from "react"
import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { TeammateDetailContent } from "@/features/settings/components/teammate-detail-content"

export default function TeammateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <>
      <title>Team Member | Urban Hive Admin</title>
      <DashboardLayout>
        <TeammateDetailContent id={id} />
      </DashboardLayout>
    </>
  )
}
