"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { SpaceDetailContent } from "@/features/spaces/components/space-detail-content"
import { use } from "react"

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <>
      <title>Space Details | Urban Hive Admin</title>
      <DashboardLayout>
        <SpaceDetailContent id={id} />
      </DashboardLayout>
    </>
  )
}
