"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { ScheduleContent } from "@/features/schedule/components/schedule-content"

export default function SchedulePage() {
  return (
    <>
      <title>Schedule | Urban Hive Admin</title>
      <DashboardLayout>
        <ScheduleContent />
      </DashboardLayout>
    </>
  )
}
