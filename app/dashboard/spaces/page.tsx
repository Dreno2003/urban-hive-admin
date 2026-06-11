"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { SpacesContent } from "@/features/spaces/components/spaces-content"

export default function SpacesPage() {
  return (
    <>
      <title>Spaces | Urban Hive Admin</title>
      <DashboardLayout>
        <SpacesContent />
      </DashboardLayout>
    </>
  )
}
