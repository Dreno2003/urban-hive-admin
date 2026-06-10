"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { ClientsContent } from "@/features/clients/components/clients-content"

export default function ClientsPage() {
  return (
    <>
      <title>Clients | Urban Hive Admin</title>
      <DashboardLayout>
        <ClientsContent />
      </DashboardLayout>
    </>
  )
}
