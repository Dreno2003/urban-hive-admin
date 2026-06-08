"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/shared/components/ui/logo"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { cn } from "@/shared/lib/utils"

import { usePathname } from "next/navigation"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // On home page, wait until scrolled past the hero section
      const threshold = pathname === "/" ? 600 : 20
      setIsScrolled(window.scrollY > threshold)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Hide header on home page when not scrolled because HomeHero has its own nav
  if (pathname === "/" && !isScrolled) return null

  const navLinks = [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Shortlet", href: "/shortlet" },
    { label: "Office", href: "/office" },
    { label: "Boardroom", href: "/boardroom" },
  ]

  return (
    <header
      className={cn(
        "hidden top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        // isScrolled 
        //   ? "bg-white/80 backdrop-blur-md border-gray-100 py-3 shadow-sm" 
        //   : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container-wrapper flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Logo variant="color" className="w-[140px] lg:w-[160px]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  // isScrolled ? "text-gray-600" : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hidden sm:flex",
              // isScrolled ? "text-gray-600" : "text-white hover:bg-white/10"
            )}
          >
            Become a Host
          </Button>
          <Button
            variant={"secondary"}
            // variant={isScrolled ? "default" : "secondary"}
            size="sm"
            className="rounded-full px-6"
          >
            Sign Up
          </Button>
          <button className={cn(
            "p-2 rounded-full transition-colors lg:hidden",
            // isScrolled ? "text-gray-900 bg-gray-50" : "text-white bg-white/10"
          )}>
            <Icon name="search" size={20} />
          </button>
          <div className={cn(
            "flex items-center justify-center size-10 rounded-full border transition-all",
            // isScrolled ? "border-gray-200 bg-white" : "border-white/20 bg-white/10"
          )}>
            <Icon name="user" size={18} className={isScrolled ? "text-gray-900" : "text-white"} />
          </div>
        </div>
      </div>
    </header>
  )
}
