"use client"

import React, { useState, useEffect } from "react"

export default function DashboardContent() {
  const [currentDate, setCurrentDate] = useState("Tuesday, May 12, 2026")

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
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Cityscape Banner Header */}
      <section
        className="relative pt-[116px] pb-24 px-8 md:px-12 flex flex-col justify-end shrink-0"
        style={{
          background: `linear-gradient(135deg, rgba(5, 12, 28, 0.85) 0%, rgba(11, 24, 48, 0.8) 50%, rgba(98, 37, 68, 0.75) 100%), url('/images/landing-page-images/home-img.jpg') center/cover no-repeat`,
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto space-y-1">
          <p className="text-white/60 text-xs font-semibold tracking-wider uppercase">
            {currentDate}
          </p>
          <h1 className="text-white text-[32px] md:text-[36px] font-bold tracking-tight">
            Good morning, Frieda
          </h1>
        </div>
      </section>

      {/* Main Content Area (Empty for step 1 as requested) */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-8 md:px-12 py-8 relative z-10 -mt-10">
        {/* Children content will go here in the next steps */}
        
      </div>
    </div>
  )
}
