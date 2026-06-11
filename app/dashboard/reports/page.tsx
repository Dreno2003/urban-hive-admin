"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { ReportsContent } from "@/features/reports/components/reports-content"

export default function ReportsPage() {
  return (
    <>
      <title>Reports | Urban Hive Admin</title>
      <DashboardLayout>
        <ReportsContent />
      </DashboardLayout>
    </>
  )
}
