"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { PaymentsContent } from "@/features/payments"

export default function PaymentsPage() {
  return (
    <>
      <title>Payments | Urban Hive Admin</title>
      <DashboardLayout>
        <PaymentsContent />
      </DashboardLayout>
    </>
  )
}
