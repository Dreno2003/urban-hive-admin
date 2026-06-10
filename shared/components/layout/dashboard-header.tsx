"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Icon } from "@/shared/components/ui/icon"
import { UserProfileDropdownMenu } from "@/shared/components/dropdowns/user-profile-dropdown-menu"
import { cn } from "@/shared/lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

interface DashboardHeaderProps {
  isCollapsed: boolean
  isScrolled: boolean
  setIsMobileOpen: (open: boolean) => void
  isHomeDashBoard?: boolean
}

export function DashboardHeader({
  isCollapsed,
  isHomeDashBoard,
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
    if (pathname.startsWith("/dashboard/clients/")) return "Clients"
    return routes[pathname] || "Dashboard"
  }

  return (
    <div >

      <header
        className={cn(
          "h-[76px]  fixed  top-0 right-0 z-20 flex transition-all duration-300 ease-in-out border-b ",
          isCollapsed ? "md:w-[calc(100%-80px)]" : "md:w-[calc(100%-260px)]",
          "w-full",
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-gray-100 shadow-sm"
            : "bg-transparent border-transparent",
          !isHomeDashBoard && "border-b !border-gray-200"


        )}
      >


        <div className="container-wrapper w-full flex items-center justify-between">

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

            {pathname.startsWith("/dashboard/clients/") ? (
              <nav className="hidden md:flex items-center gap-1.5 text-[15px] font-normal tracking-tight select-none">
                <Link href="/dashboard/clients" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Clients
                </Link>
                <ChevronRight className="size-3.5 text-gray-400" />
                <span className="text-foreground font-semibold">Client details</span>
              </nav>
            ) : (
              <h2
                className={cn(
                  "text-lg font-normal tracking-tight select-none transition-colors hidden md:block",
                  isScrolled ? "text-foreground" : "text-white",
                  !isHomeDashBoard && 'text-foreground'
                )}
              >
                {getPageTitle()}
              </h2>
            )}
          </div>

          {/* Right Side: Search, Notifications, Profile */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* Search Input */}
            <div className="relative hidden sm:block w-[260px] md:w-[380px]">
              {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon
              name="search"
              size={20}
              className="text-[#5F606A]"
            />
          </div> */}
              <Input
                icon={<Icon name="search" size={20} className="text-icon-default" />}
                type="text"
                autoComplete="off"
                placeholder="Search dashboard"
                className="w-full h-[46px] pl-12 pr-4 rounded-full text-[15px] font-medium    border-none outline-none transition-all duration-200 ]"
              />
            </div>

            {/* Notification Button */}
            <Button
              size={'icon-lg'}
              variant={'secondary'}
              className={cn(
                "s rounded-full flex items-center hover:!bg-white justify-center transition-all duration-200 cursor-pointer text-secondary-foreground",
                isScrolled
                  ? "bg-white border border-gray-100 "
                  : "bg-white border-transparent  ",
                !isHomeDashBoard && '!bg-secondary'
              )}
            >
              <Icon name="bell2" size={20} />
            </Button>

            {/* Profile Dropdown */}
            <UserProfileDropdownMenu isHomeDashBoard={isHomeDashBoard} isDarkBackground={!isScrolled} />
          </div>

        </div>
      </header>

    </div>
  )
}
