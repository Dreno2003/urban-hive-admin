"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Icon } from "@/shared/components/ui/icon"
import { UserProfileDropdownMenu } from "@/shared/components/dropdowns/user-profile-dropdown-menu"
import { cn } from "@/shared/lib/utils"

interface DashboardHeaderProps {
  isCollapsed: boolean
  isScrolled: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function DashboardHeader({
  isCollapsed,
  isScrolled,
  setIsMobileOpen,
}: DashboardHeaderProps) {
  const pathname = usePathname()

  // Dynamic Page Title Resolution based on pathname
  const getPageTitle = () => {
    const routes: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/dashboard/onboarding": "Onboarding guide",
      "/dashboard/bookings": "Bookings",
      "/dashboard/clients": "Clients",
      "/dashboard/reports": "Reports",
      "/dashboard/schedule": "Schedule",
      "/dashboard/spaces": "Spaces",
      "/dashboard/payments": "Payments",
      "/dashboard/communication": "Communication",
      "/dashboard/settings": "Settings",
    }
    return routes[pathname] || "Dashboard"
  }

  return (
    <header
      className={cn(
        "h-[76px] px-6 fixed top-0 right-0 z-20 flex items-center justify-between transition-all duration-300 ease-in-out border-b",
        isCollapsed ? "md:w-[calc(100%-80px)]" : "md:w-[calc(100%-260px)]",
        "w-full",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-100 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      {/* Left Side: Hamburger (Mobile) / Page Title (Desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            "p-2 rounded-xl transition-colors md:hidden cursor-pointer",
            isScrolled
              ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              : "text-white hover:bg-white/10"
          )}
        >
          <Icon name="grid" size={20} />
        </button>

        <h2
          className={cn(
            "text-lg font-bold tracking-tight select-none transition-colors hidden md:block",
            isScrolled ? "text-gray-900" : "text-white"
          )}
        >
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Side: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden sm:block w-[240px] md:w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon
              name="search"
              size={16}
              className={cn(
                "transition-colors",
                isScrolled ? "text-gray-400" : "text-white/60"
              )}
            />
          </div>
          <input
            type="text"
            placeholder="Search dashboard"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-full text-[14px] font-medium border transition-all duration-200 outline-none",
              isScrolled
                ? "bg-gray-100 border-transparent text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-200"
                : "bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/20"
            )}
          />
        </div>

        {/* Notification Button */}
        <button
          className={cn(
            "p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center relative hover:opacity-85 cursor-pointer",
            isScrolled
              ? "bg-gray-50 border-gray-100 text-gray-900 hover:bg-gray-100"
              : "bg-white/10 border-white/10 text-white hover:bg-white/20"
          )}
        >
          <Icon name="bell" size={16} />
          {/* Badge indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffc107] ring-1 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <UserProfileDropdownMenu isDarkBackground={!isScrolled} />
      </div>
    </header>
  )
}
