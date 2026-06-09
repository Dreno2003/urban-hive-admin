"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { BookingsContent } from "@/features/bookings/components/bookings-content"

export default function BookingsPage() {
  return (
    <>
      <title>Bookings | Urban Hive Admin</title>
      <DashboardLayout>
        <BookingsContent />
      </DashboardLayout>
    </>
  )
}
