"use client"

import DashboardLayout from "@/shared/components/layout/dashboard-layout"
import { ClientDetailContent } from "@/features/clients/components/client-detail-content"
import { use } from "react"

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <>
      <title>Client Details | Urban Hive Admin</title>
      <DashboardLayout>
        <ClientDetailContent id={id} />
      </DashboardLayout>
    </>
  )
}
