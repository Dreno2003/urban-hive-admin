"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSpaceDetail } from "../hooks/use-spaces"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Separator } from "@/shared/components/ui/separator"
import { Badge } from "@/shared/components/ui/badge"
import { Icon } from "@/shared/components/ui/icon"
import { Pagination } from "@/shared/components/ui/pagination"
import { ActivityDetailDialog } from "./activity-detail-dialog"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { BookSpaceDialog } from "./book-space-dialog"
import { RemoveButton } from "./remove-button"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import type { SpaceActivity } from "../types"



const AMENITY_ICONS: Record<string, string> = {
  "Wi-Fi": "wifi2",
  "Air conditioning": "ac2",
  "Washing machine": "washingMachine2",
  "Kitchen": "kitchen2",
}

export function SpaceDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const { data: space, isLoading } = useSpaceDetail(id)

  // Tab State: "activity" | "feedback" | "reports"
  const [activeTab, setActiveTab] = useState<"activity" | "feedback" | "reports">("activity")
  const [page, setPage] = useState(1)

  // Dialog States
  const [selectedActivity, setSelectedActivity] = useState<SpaceActivity | null>(null)
  const [bookSpaceOpen, setBookSpaceOpen] = useState(false)

  // Space state controls (mock toggle states)
  const [isFrozen, setIsFrozen] = useState(false)
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&auto=format&fit=crop&q=60",
  ])
  const [video, setVideo] = useState<string | null>(
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=60"
  )



  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (name === "AV housing") return "TJ"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle actions
  const handleEditSpace = () => {
    toast.info("Edit space mode opening...")
  }

  const handleToggleFreeze = () => {
    setIsFrozen(!isFrozen)
    toast.success(isFrozen ? "Space has been unfrozen" : "Space has been frozen")
  }

  const handleRemoveSpace = () => {
    toast.error("Remove space triggered. Please confirm details first.")
  }

  const handleSelectClient = (clientName: string, clientId: string) => {
    toast.success(`Booking successfully created for ${clientName}!`)
    setBookSpaceOpen(false)
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    toast.info("Image removed from space listing")
  }

  const handleRemoveVideo = () => {
    setVideo(null)
    toast.info("Video removed from space listing")
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full container-wrapper pt-8 pb-12 mt-[76px]">
        {/* ── Space Profile Card ────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 mb-6">
          {/* Top row: Avatar + Name, Location, Space Type + Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              {isLoading ? (
                <Skeleton className="size-[72px] rounded-full bg-gray-200 dark:bg-gray-800" />
              ) : (
                <div className="size-[72px] rounded-full bg-blue-500 border-2 border-blue-400 flex items-center justify-center shrink-0 text-white text-[24px] font-bold">
                  {getInitials(space?.name ?? "")}
                </div>
              )}
              <div className="flex flex-wrap items-start gap-8 lg:gap-16">
                <div>
                  <p className="text-[12px] text-secondary-foreground  tracking-wider mb-0.5">Name</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-800" />
                  ) : (
                    <p className="text-body-base font-medium dark:text-white leading-tight">
                      {space?.name}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-body-sm text-secondary-foreground  tracking-wider mb-0.5">Space location</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800" />
                  ) : (
                    <p className="text-body-base font-medium leading-tight">
                      {space?.location}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-body-sm text-secondary-foreground  tracking-wider mb-0.5">Space type</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-800" />
                  ) : (
                    <p className="text-body-base font-medium leading-tight">
                      {space?.spaceType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0 self-end lg:self-center">
              <Button
                variant="secondary-outline"
                className="h-[36px] px-5 rounded-full text-[13px] border-gray-200 dark:border-gray-800 font-medium text-gray-700 dark:text-gray-300"
                onClick={handleEditSpace}
              >
                Edit space
              </Button>
              <Button
                variant="secondary-outline"
                className="h-[36px] px-5 rounded-full text-[13px] border-gray-200 dark:border-gray-800 font-medium text-gray-700 dark:text-gray-300"
                onClick={handleToggleFreeze}
              >
                {isFrozen ? "Unfreeze space" : "Freeze space"}
              </Button>
              <Button
                variant="secondary-outline"
                className="h-[36px] px-5 rounded-full text-[13px]   text-red-500 hover:bg-red-50/80 border font-bold dark:bg-red-950/20 dark:border-red-900/30"
                onClick={handleRemoveSpace}
              >
                Remove space
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-gray-100 dark:bg-gray-800" />

          {/* Info grid: space rate, monthly rate, amenities, capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_4fr_3fr] gap-6 mb-6">
            <div>
              <p className="text-body-sm text-secondary-foreground  tracking-wider mb-1">Space rate</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-800" />
              ) : (
                <p className="text-base font-medium leading-tight">
                  {space?.rate?.split("/")[0]}
                </p>
              )}
            </div>
            <div>
              <p className="text-body-sm text-secondary-foreground  tracking-wider mb-1">Monthly rate</p>
              {isLoading ? (
                <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800" />
              ) : (
                <p className="text-base font-medium  leading-tight">
                  {space?.monthlyRate}
                </p>
              )}
            </div>
            <div>
              <p className="text-body-sm text-secondary-foreground font tracking-wider mb-2">Space amenities</p>
              {isLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {space?.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]  border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-secondary-foreground"
                    >
                      {AMENITY_ICONS[amenity] && (
                        <Icon name={AMENITY_ICONS[amenity]} className="size-3.5 text-gray-500" />
                      )}
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-body-sm text-secondary-foreground  tracking-wider mb-2">Space capacity</p>
              {isLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <span className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-[12.5px] text-secondary-foreground dark:text-gray-300">
                    <Icon name="bed2" size={14} className="text-secondary-foreground shrink-0" />
                    {space?.bedrooms} bedroom
                  </span>
                  <span className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-[12.5px]  text-secondary-foreground dark:text-gray-300">
                    <Icon name="bath2" size={14} className="text-secondary-foreground shrink-0" />
                    {space?.bathrooms} bathroom
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-gray-100 dark:bg-gray-800" />

          {/* Space Description */}
          <div className="mb-6">
            <p className="text-body-sm text-secondary-foreground  tracking-wider mb-1.5">Space description</p>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : (
              <p className="text-body-base leading-relaxed  font-medium">
                {space?.description}
              </p>
            )}
          </div>

          <Separator className="my-6 bg-gray-100 dark:bg-gray-800" />

          {/* Images & Video files display */}
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <p className="text-body-sm text-secondary-foreground  tracking-wider mb-2">Space images</p>
              {isLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="size-[84px] bg-gray-200 dark:bg-gray-800 rounded-[14px]" />
                  <Skeleton className="size-[84px] bg-gray-200 dark:bg-gray-800 rounded-[14px]" />
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  {images.map((imgUrl, i) => (
                    <div key={i} className="relative size-[84px] shrink-0 group">
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover rounded-[14px] border border-gray-100 dark:border-gray-800"
                      />
                      <RemoveButton onClick={() => handleRemoveImage(i)} ariaLabel="Remove image" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 md:w-[200px]">
              <p className="text-body-sm text-secondary-foreground font-medium tracking-wider mb-2">Space video</p>
              {isLoading ? (
                <Skeleton className="size-[84px] bg-gray-200 dark:bg-gray-800 rounded-[14px]" />
              ) : video ? (
                <div className="relative size-[84px] shrink-0">
                  <div className="relative size-full rounded-[14px] overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <img src={video} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
                    {/* Play Button Overlay */}
                    <img src={'/images/play-button.png'} className="size-8 relative " />
                  </div>
                  <RemoveButton onClick={handleRemoveVideo} ariaLabel="Remove video" />
                </div>
              ) : (
                <span className="text-[13px] text-secondary-foreground font-medium italic">
                  No video files added.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Space Tabs & Table ────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] ">
          {/* Tabs header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1 bg-[#F2F2F7] dark:bg-gray-800 rounded-full p-1 w-fit">
              <button
                onClick={() => {
                  setActiveTab("activity")
                  setPage(1)
                }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeTab === "activity" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                Space activity
              </button>
              <button
                onClick={() => {
                  setActiveTab("feedback")
                  setPage(1)
                }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeTab === "feedback" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                Feedback
              </button>
              <button
                onClick={() => {
                  setActiveTab("reports")
                  setPage(1)
                }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeTab === "reports" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                Reports
              </button>
            </div>

            <button
              onClick={() => toast.info("Filter clicked")}
              className="flex items-center justify-center gap-1.5 h-[36px] px-4 rounded-[32px] text-sm font-medium transition-colors bg-secondary dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground whitespace-nowrap cursor-pointer border-none"
            >
              <Icon name="sort" size={16} className="text-secondary-foreground shrink-0" />
              Filter
              <Icon name="chevronDown" size={16} className="text-secondary-foreground ml-0.5" />
            </button>
          </div>

          {/* Tables layout */}
          <div className="flex flex-col">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-5 gap-3 border-b dark:border-gray-800 animate-pulse">
                  <Skeleton className="h-4 bg-gray-100 dark:bg-gray-800 w-full" />
                </div>
              ))
            ) : (
              <>
                {/* ── 1. Tab Content: Space Activity ───────────────── */}
                {activeTab === "activity" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary dark:bg-gray-800/40 border-b dark:border-gray-800">
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[5%]">
                            <Checkbox />
                          </th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[22%]">Booked by</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[15%]">Date booked</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[15%]">Check in</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[15%]">Check out</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[10%]">Duration</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[10%]">Status</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[8%]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {space?.activity?.map((act) => (
                          <tr key={act.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors text-[13.5px] text-gray-700 dark:text-gray-300 font-medium">
                            <td className="px-6 py-4.5">
                              <Checkbox />
                            </td>
                            <td className="px-6 py-4.5 text dark:text-white text-secondary-foreground ">{act.bookedBy}</td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{act.dateBooked}</td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{act.checkIn}</td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{act.checkOut}</td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{act.duration}</td>
                            <td className="px-6 py-4.5">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11.5px] font-medium border rounded-full",
                                act.status === "Active"
                                  ? "bg-white text-gray-800 border-gray-200"
                                  : "bg-white text-gray-800 border-gray-200"
                              )}>
                                <span className={cn(
                                  "size-1.5 rounded-full",
                                  act.status === "Active" ? "bg-green-500" : "bg-gray-400"
                                )} />
                                {act.status}
                              </span>
                            </td>
                            <td className="px-6 py-4.5">
                              <button
                                onClick={() => setSelectedActivity(act)}
                                className="text-primary font-bold hover:underline cursor-pointer bg-transparent border-none p-0 text-[13.5px]"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── 2. Tab Content: Feedback ─────────────────────── */}
                {activeTab === "feedback" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary dark:bg-gray-800/40 border-b dark:border-gray-800">
                          <th className="px-6 py-3.5 text-body-lg font-medium  w-[20%]">Client</th>
                          <th className="px-6 py-3.5 text-body-lg font-medium  w-[65%]">Comment</th>
                          <th className="psx-6 py-3.5 text-body-lg font-medium  w-[15%]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {space?.feedback?.map((fb) => (
                          <tr key={fb.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors text-[13.5px] *:text-secondary-foreground dark:text-gray-300 ">
                            <td className="px-6 py-5 dark:text-white ">{fb.client}</td>
                            <td className="px-6 py-5 leading-relaxed text-gray-500 dark: text-secondary-foreground font-medium">{fb.comment}</td>
                            <td className="pxs-6 py-5">
                              <button
                                onClick={() => toast.success("Review status updated!")}
                                className="text-primary text-left  hover:underline cursor-pointer bg-transparent border-none p-0 text-[13.5px]"
                              >
                                Display on space page
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── 3. Tab Content: Reports ──────────────────────── */}
                {activeTab === "reports" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary dark:bg-gray-800/40 border-b dark:border-gray-800">
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[10%]">ID</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[18%]">Client</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[18%]">Space</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[18%]">Category</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[15%]">Date</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[13%]">Status</th>
                          <th className="px-6 py-3.5 text-[12.5px] font-medium text-secondary-foreground w-[8%]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {space?.reports?.map((rep) => (
                          <tr key={rep.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors text-[13.5px] text-gray-700 dark:text-gray-300 font-medium">
                            <td className="px-6 py-4.5 font-mono  text-secondary-foreground font-bold">{rep.id}</td>
                            <td className="px-6 py-4.5 text-gray-900 dark:text-white font-bold">{rep.client}</td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{rep.space}</td>
                            <td className="px-6 py-4.5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark: text-secondary-foreground bg-[#F9F9FB] dark:bg-gray-800">
                                {rep.category}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-gray-500 dark: text-secondary-foreground">{rep.date}</td>
                            <td className="px-6 py-4.5">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11.5px] font-medium border rounded-full",
                                rep.status === "Resolved"
                                  ? "bg-[#E6F9EE] text-[#00A854] border-[#B3F2CE]"
                                  : "bg-[#FFF8E6] text-[#FE9A00] border-[#FFE2B3]"
                              )}>
                                <span className={cn(
                                  "size-1.5 rounded-full",
                                  rep.status === "Resolved" ? "bg-[#00A854]" : "bg-[#FE9A00]"
                                )} />
                                {rep.status}
                              </span>
                            </td>
                            <td className="px-6 py-4.5">
                              <button
                                onClick={() => toast.info(`Viewing ticket ${rep.id} details`)}
                                className="text-primary font-bold hover:underline cursor-pointer bg-transparent border-none p-0 text-[13.5px]"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination (customized counts to look identical to design) */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <Pagination
                    currentPage={page}
                    totalPages={activeTab === "activity" ? 8 : 1}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Space Activity Detail Modal ──────────────────── */}
      <ActivityDetailDialog
        activity={selectedActivity}
        open={!!selectedActivity}
        onOpenChange={(o) => { if (!o) setSelectedActivity(null) }}
      />

      {/* ── "Which client?" Booking Modal ────────────────── */}
      <BookSpaceDialog
        open={bookSpaceOpen}
        onOpenChange={setBookSpaceOpen}
        onSelectClient={handleSelectClient}
      />
    </div>
  )
}
