"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/shared/components/ui/logo"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"

interface SidebarItem {
  label: string
  href: string
  icon: string
}

interface SidebarGroup {
  category: string
  items: SidebarItem[]
}

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname()

  const navGroups: SidebarGroup[] = [
    {
      category: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "grid" },
        { label: "Onboarding guide", href: "/dashboard/onboarding", icon: "signpost1" },
      ],
    },
    {
      category: "Clients",
      items: [
        { label: "Bookings", href: "/dashboard/bookings", icon: "calendar" },
        { label: "Clients", href: "/dashboard/clients", icon: "users" },
        { label: "Reports", href: "/dashboard/reports", icon: "globe" },
      ],
    },
    {
      category: "Operations",
      items: [
        { label: "Schedule", href: "/dashboard/schedule", icon: "calender2" },
        { label: "Spaces", href: "/dashboard/spaces", icon: "building" },
        { label: "Payments", href: "/dashboard/payments", icon: "link2" },
        { label: "Communication", href: "/dashboard/communication", icon: "mail" },
      ],
    },
  ]

  const bottomItems: SidebarItem[] = [
    { label: "Settings", href: "/dashboard/settings", icon: "settings" },
    { label: "Log out", href: "/create-account", icon: "x2" },
  ]

  const renderLink = (item: SidebarItem) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 select-none group",
          isActive
            ? "bg-primary-50 text-primary-300 font-semibold"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          name={item.icon as any}
          size={20}
          className={cn(
            "transition-colors shrink-0",
            isActive ? "text-primary-300" : "text-gray-400 group-hover:text-gray-700"
          )}
        />
        {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-[76px] px-6 flex items-center justify-between border-b border-gray-50 shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center">
              <Logo variant="color" className="w-[110px]" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer",
              isCollapsed ? "mx-auto" : ""
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name="widget" size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 hide-scrollbar">
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              {!isCollapsed ? (
                <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase px-3 select-none">
                  {group.category}
                </span>
              ) : (
                <div className="h-px bg-gray-100 mx-2 my-4" />
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>{renderLink(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-gray-50 space-y-1 shrink-0">
          {bottomItems.map(renderLink)}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={cn(
          "flex flex-col bg-white border-r border-gray-100 fixed inset-y-0 left-0 w-[260px] z-50 transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-[76px] px-6 flex items-center justify-between border-b border-gray-50 shrink-0">
          <Link href="/dashboard" className="flex items-center" onClick={() => setIsMobileOpen(false)}>
            <Logo variant="color" className="w-[110px]" />
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 hide-scrollbar">
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase px-3 select-none">
                {group.category}
              </span>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>{renderLink(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-50 space-y-1 shrink-0">
          {bottomItems.map(renderLink)}
        </div>
      </aside>
    </>
  )
}
