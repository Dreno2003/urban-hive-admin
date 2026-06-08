"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/shared/components/layout/sidebar"
import { DashboardHeader } from "@/shared/components/layout/dashboard-header"
import { cn } from "@/shared/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scrolling to toggle header styling (translucent white glassmorphism when scrolled)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible/Responsive Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Shell Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[260px]"
        )}
      >
        {/* Sticky/Responsive Top Header */}
        <DashboardHeader
          isCollapsed={isCollapsed}
          isScrolled={isScrolled}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col pt-0 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
