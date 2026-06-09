"use client"

import React, { useState, useEffect } from "react"
import { InsetCard } from "@/shared/components/ui/inset-card"
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { UpcomingBookingsCard } from "@/features/dashboard/components/upcoming-bookings-card"
import { SpaceOccupancyCard } from "@/features/dashboard/components/space-occupancy-card"
import { RecentPaymentsCard } from "@/features/dashboard/components/recent-payments-card"

export default function DashboardContent() {
  const [currentDate, setCurrentDate] = useState("Tuesday, May 12, 2026")
  const { data, isLoading, error } = useDashboardSummary()

  useEffect(() => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    setCurrentDate(today.toLocaleDateString("en-US", options))
  }, [])

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cityscape Banner Header */}
      <section
        className="relative pt-[116px] pb-16 px-8 md:px-12 flex flex-col justify-end shrink-0"
        style={{
          background: `linear-gradient(135deg, rgba(5, 12, 28, 0.85) 0%, rgba(11, 24, 48, 0.8) 50%, rgba(98, 37, 68, 0.75) 100%), url('/images/landing-page-images/home-img.jpg') center/cover no-repeat`,
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto space-y-1">
          <p className="text-white/60 text-xs font-semibold tracking-wider ">
            {currentDate}
          </p>
          <h1 className="text-white text-[25px]  font-bold tracking-tight">
            Good morning, Frieda
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 w-full mx-auto px-8 md:px-12 py-8 relative z-10 -mt-[4.5rem]">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Premium skeleton loaders reuse InsetCard wrapper structure
            Array.from({ length: 3 }).map((_, i) => (
              <InsetCard key={i} title={<Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />}>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-10 w-16 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
                </div>
              </InsetCard>
            ))
          ) : error ? (
            <div className="col-span-full py-12 text-center text-red-500 dark:text-red-400 font-semibold">
              Failed to load dashboard summary data. Please try again later.
            </div>
          ) : (
            <>
              {/* Active Clients Card */}
              {data?.activeClients && (
                <InsetCard title="Active clients">
                  <InsetCard.Metric 
                    value={data.activeClients.value} 
                    trend={data.activeClients.trend} 
                    trendType={data.activeClients.trendType} 
                  />
                </InsetCard>
              )}

              {/* Today's Bookings Card */}
              {data?.todaysBookings && (
                <InsetCard title="Today's bookings">
                  <InsetCard.Metric 
                    value={data.todaysBookings.value} 
                    trend={data.todaysBookings.trend} 
                    trendType={data.todaysBookings.trendType} 
                  />
                </InsetCard>
              )}

              {/* Revenue Card (Nigerian Naira ₦) */}
              {data?.revenue && (
                <InsetCard title={`Revenue (${data.revenue.month})`}>
                  <InsetCard.Metric 
                    value={data.revenue.value} 
                    trend={data.revenue.trend} 
                    trendType={data.revenue.trendType} 
                  />
                </InsetCard>
              )}
            </>
          )}
        </div>

        {/* Second Row — Upcoming Bookings (wide) + Space Occupancy (narrow) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Upcoming today — takes 2/3 of the row */}
          <div className="">
            <UpcomingBookingsCard />
          </div>

          {/* Space Occupancy — takes 1/3 of the row */}
          <div className="">
            <SpaceOccupancyCard />
          </div>
        </div>

        {/* Third Row — Recent Payments (full width) */}
        <div className="mt-6">
          <RecentPaymentsCard />
        </div>
      </div>
    </div>
  )
}


