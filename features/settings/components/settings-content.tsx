"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "@/shared/components/ui/password-input"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Separator } from "@/shared/components/ui/separator"
import { Pagination } from "@/shared/components/ui/pagination"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Badge } from "@/shared/components/ui/badge"
import { useProfile, useUpdateProfile, useTeammatesList, useNotifications, useUpdateNotifications } from "../hooks/use-settings"
import { ChangePasswordDialog } from "./change-password-dialog"
import { Switch } from "@/shared/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { PaymentPolicyDialog } from "./payment-policy-dialog"
import { InviteTeammateDialog } from "./invite-dialog"
import { ViewPermissionsDialog, ViewRolesDialog } from "./permissions-roles-dialogs"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import type { Teammate } from "../types"

const profileSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
})

const TABLE_COLS = ["ID", "Name", "Role", "Status", "Date joined", "Action"]
const TABLE_WIDTHS = ["w-[10%]", "w-[30%]", "w-[18%]", "w-[15%]", "w-[17%]", "w-[10%]"]

export function SettingsContent() {
  // Navigation
  const router = useRouter()

  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "policy" | "space" | "notifications">("profile")

  // Policies State
  const [policies, setPolicies] = useState({
    earlyCancellation: true,
    lateCancellation: true,
    thursdayReminders: true,
    lockOverdueSpaces: true,
  })

  // Space settings state
  const [spaceSettings, setSpaceSettings] = useState({
    liveAvailability: true,
    sameDayBookings: true,
    showPricing: true,
  })
  const [bookingNotice, setBookingNotice] = useState<string>("no-minimum")

  // Notifications State
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotifications()
  const { mutateAsync: updateNotifications, isPending: isSavingNotifications } = useUpdateNotifications()
  const [notifications, setNotifications] = useState({
    newInquiryAlerts: true,
    paymentConfirmations: true,
    overdueWarnings: true,
    dailyScheduleDigest: true,
  })

  useEffect(() => {
    if (notificationsData) setNotifications(notificationsData)
  }, [notificationsData])

  // Payment policy dialog state
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false)
  const [isEditPolicyOpen, setIsEditPolicyOpen] = useState(false)

  // Profile Form States
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()

  // Team management State
  const [teammatePage, setTeammatePage] = useState(1)
  const [roleFilter, setRoleFilter] = useState<string>("All")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch paginated teammates list
  const { data: teammatesData, isLoading: isTeammatesLoading } = useTeammatesList(teammatePage, {
    role: roleFilter,
  })

  // Handle outside click to close filter dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sync tab from URL query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab === "team") {
        setActiveTab("team")
      } else if (tab === "policy") {
        setActiveTab("policy")
      } else if (tab === "profile") {
        setActiveTab("profile")
      }
    }
  }, [])

  // Profile Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      avatar: profile?.avatar || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile(values)
        toast.success("Profile updated successfully")
      } catch (err: any) {
        toast.error(err.message || "Failed to update profile")
      }
    },
  })

  // Compute initials
  const getInitials = (first = "", last = "") => {
    const f = first ? first.trim().charAt(0) : "F"
    const l = last ? last.trim().charAt(0) : "O"
    return (f + l).toUpperCase()
  }

  const handleEditImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        formik.setFieldValue("avatar", reader.result as string)
        formik.setFieldTouched("avatar", true, false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleViewTeammate = (teammate: Teammate) => {
    router.push(`/dashboard/settings/team/${teammate.id}`)
  }

  const handleRoleFilterSelect = (role: string) => {
    setRoleFilter(role)
    setTeammatePage(1)
    setIsFilterDropdownOpen(false)
  }

  const teammates = teammatesData?.teammates || []
  const totalTeammatePages = teammatesData?.totalPages || 1

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full px-8 md:px-12 pt-8 pb-12 mt-[76px]">
        {/* ── Title & Subtitle ────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Urban Hub management, users and preferences
          </p>
        </div>

        {/* ── Tabs Capsule ────────────────────────────────── */}
        <div className="flex bg-[#F2F2F7] dark:bg-gray-800 rounded-full p-1 w-fit mb-8 max-w-full overflow-x-auto select-none hide-scrollbar gap-0.5">
          {/* Profile Tab button */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap",
              activeTab === "profile"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <Icon name="user2" size={16} className={cn(activeTab === "profile" ? "text-primary-300" : "text-gray-400")} />
            Profile
          </button>

          {/* Team management Tab button */}
          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap",
              activeTab === "team"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <Icon name="users" size={16} className={cn(activeTab === "team" ? "text-primary-300" : "text-gray-400")} />
            Team management
          </button>

          {/* Payment policy Tab button */}
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap",
              activeTab === "policy"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <Icon name="creditCard" size={16} className={cn(activeTab === "policy" ? "text-primary-300" : "text-gray-400")} />
            Payment policy
          </button>

          {/* Space settings Tab button */}
          <button
            type="button"
            onClick={() => setActiveTab("space")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap",
              activeTab === "space"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <Icon name="settings" size={16} className={cn(activeTab === "space" ? "text-primary-300" : "text-gray-400")} />
            Space settings
          </button>

          {/* Notifications Tab button */}
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap",
              activeTab === "notifications"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <Icon name="bell3" size={16} className={cn(activeTab === "notifications" ? "text-primary-300" : "text-gray-400")} />
            Notifications
          </button>
        </div>

        {/* ── Tab Content Area ────────────────────────────── */}
        <div className="animate-in fade-in duration-300">
          {/* PROFILE VIEW */}
          {activeTab === "profile" && (
            <div className="max-w-[720px]">
              {isProfileLoading ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <div className="w-24 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <div className="h-14 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  </div>
                  <div className="h-14 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-8">
                  {/* Avatar upload */}
                  <div className="flex items-center gap-5">
                    <div className="relative size-24 shrink-0 rounded-full bg-[#4D49FF] flex items-center justify-center text-white text-3xl font-semibold overflow-hidden shadow-inner select-none">
                      {formik.values.avatar ? (
                        <img
                          src={formik.values.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getInitials(formik.values.firstName, formik.values.lastName)
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleEditImageClick}
                      className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs py-1.5 px-4 font-semibold transition-colors cursor-pointer"
                    >
                      Edit image
                    </button>
                  </div>

                  <Separator className="dark:bg-gray-800" />

                  {/* Profile inputs */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
                          First name
                        </label>
                        <Input
                          name="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          icon={<Icon name="user" size={18} className="text-gray-400" />}
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.firstName && formik.errors.firstName}
                          className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
                          Last name
                        </label>
                        <Input
                          name="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          icon={<Icon name="user" size={18} className="text-gray-400" />}
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.lastName && formik.errors.lastName}
                          className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        icon={<Icon name="mail" size={18} className="text-gray-400" />}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                        className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <Button
                    type="submit"
                    loading={isUpdatingProfile}
                    disabled={isUpdatingProfile || !formik.dirty}
                    className="w-full bg-primary hover:bg-primary-600 text-white font-bold rounded-full h-[48px] transition-all cursor-pointer select-none"
                  >
                    Save changes
                  </Button>

                  <Separator className="dark:bg-gray-800" />

                  {/* Security Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
                        Security
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsPasswordDialogOpen(true)}
                        className="text-sm text-primary-300 dark:text-primary-400 font-semibold hover:underline cursor-pointer transition-colors"
                      >
                        Change password
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
                        Password
                      </label>
                      <PasswordInput
                        name="passwordMask"
                        value="••••••••"
                        disabled
                        isShowEndIcon={false}
                        className="bg-secondary/60 cursor-not-allowed opacity-75 select-none h-[44px]"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TEAM MANAGEMENT VIEW */}
          {activeTab === "team" && (
            <div className="space-y-6">
              {/* ── Team Header Card ── */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight">
                  Team management
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPermissionsDialogOpen(true)}
                    className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs py-2 px-4 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                  >
                    <Icon name="eye" size={14} className="text-gray-500" />
                    View permissions
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRolesDialogOpen(true)}
                    className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs py-2 px-4 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                  >
                    <Icon name="eye" size={14} className="text-gray-500" />
                    View team roles
                  </button>
                </div>
              </div>

              {/* ── Teammates Table Card ── */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px]">
                {/* Panel actions header */}
                <div className="flex p-6 items-center justify-between">
                  <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
                    Teammates
                  </h4>
                  <div className="flex items-center gap-3 relative">
                    {/* Role Filter dropdown trigger */}
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        className="rounded-full bg-[#F2F2F7] dark:bg-gray-800 hover:bg-gray-200/80 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm py-2 px-4.5 font-medium flex items-center gap-1.5 cursor-pointer transition-colors border border-transparent select-none"
                      >
                        <Icon name="sort" size={14} className="text-gray-500" />
                        Filter: {roleFilter}
                        <Icon name="chevronDown" size={12} className="text-gray-500 ml-0.5" />
                      </button>

                      {/* Dropdown menu */}
                      {isFilterDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1.5 z-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden min-w-[150px] py-1">
                          {["All", "Administrator", "Manager", "Staff"].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleRoleFilterSelect(role)}
                              className={cn(
                                "w-full text-left px-4.5 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
                                role === roleFilter ? "text-primary-300 bg-gray-50/50 dark:bg-gray-800/30" : "text-gray-700 dark:text-gray-300"
                              )}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Invite Button */}
                    <button
                      type="button"
                      onClick={() => setIsInviteDialogOpen(true)}
                      className="rounded-full bg-primary hover:bg-primary-600 text-white text-sm py-2 px-5 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                    >
                      <Icon name="plus" size={14} />
                      Invite
                    </button>
                  </div>
                </div>

                {/* Table Layout */}
                <div className="flex items-center bg-secondary dark:bg-gray-800 px-6 py-3.5 border-y border-gray-100 dark:border-gray-800">
                  {TABLE_COLS.map((col, idx) => (
                    <span
                      key={col}
                      className={cn("text-[12.5px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide", TABLE_WIDTHS[idx])}
                    >
                      {col}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col divide-y divide-gray-50 dark:divide-gray-850">
                  {isTeammatesLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center px-6 py-5 gap-2 animate-pulse">
                        {TABLE_WIDTHS.map((w, j) => (
                          <Skeleton key={j} className={cn("h-4 bg-gray-100 dark:bg-gray-800", w)} />
                        ))}
                      </div>
                    ))
                  ) : teammates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[15px] font-semibold text-gray-900 dark:text-white">No teammates</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">No teammates records found</p>
                    </div>
                  ) : (
                    teammates.map((member, idx) => (
                      <div
                        key={member.id}
                        className={cn(
                          "flex items-center px-6 py-4.5 hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors"
                        )}
                      >
                        {/* ID Column */}
                        <span className={cn("text-[13px] text-gray-400 dark:text-gray-500 font-mono", TABLE_WIDTHS[0])}>
                          {member.id}
                        </span>

                        {/* Name Column with Avatar */}
                        <div className={cn("flex items-center gap-3 pr-3", TABLE_WIDTHS[1])}>
                          <div
                            className={cn(
                              "size-9 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden select-none",
                              member.id === "00001" ? "bg-[#4D49FF]" : member.id === "00002" ? "bg-[#7C4DFF]" : "bg-primary-300"
                            )}
                          >
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              getInitials(member.firstName, member.lastName)
                            )}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 truncate">
                              {member.firstName} {member.lastName}
                            </span>
                            <span className="text-[11.5px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                              {member.email}
                            </span>
                          </div>
                        </div>

                        {/* Role Column */}
                        <div className={cn(TABLE_WIDTHS[2])}>
                          <Badge variant="default-outline" className="!h-fit">
                            {member.role}
                          </Badge>
                        </div>

                        {/* Status Column */}
                        <div className={cn(TABLE_WIDTHS[3])}>
                          <Badge variant="default-outline" iconName="circle" iconClassName="!size-2" className="">
                            {member.status}
                          </Badge>
                        </div>

                        {/* Date Joined Column */}
                        <span className={cn("text-[13px] text-gray-500 dark:text-gray-400", TABLE_WIDTHS[4])}>
                          {member.dateJoined}
                        </span>

                        {/* Action Column */}
                        <button
                          type="button"
                          onClick={() => handleViewTeammate(member)}
                          className={cn(
                            "text-[13px] text-primary-300 dark:text-primary-400 font-semibold cursor-pointer hover:underline text-left",
                            TABLE_WIDTHS[5]
                          )}
                        >
                          View profile
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Separator & Pagination */}
                <Separator className="dark:bg-gray-800" />
                {totalTeammatePages > 1 && (
                  <div className="px-6 pb-2.5">
                    <Pagination
                      currentPage={teammatePage}
                      totalPages={totalTeammatePages}
                      onPageChange={setTeammatePage}
                      variant="compact"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYMENT POLICY VIEW */}
          {activeTab === "policy" && (
            <div className="space-y-6">
              {/* ── Payment Policy Header Card ── */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight">
                  Payment policy
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant={'secondary-outline'}
                    size={'sm'}
                    onClick={() => setIsAddPolicyOpen(true)}
                    className="rounded-full dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs py-2 px-4 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                  >
                    <Icon name="plus" size={14} className="text-gray-500" />
                    Add policy
                  </Button>
                  <Button
                    type="button"
                    variant={'secondary-outline'}
                    size={'sm'}
                    onClick={() => setIsEditPolicyOpen(true)}
                    className="rounded-full dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs py-2 px-4 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                  >
                    <Icon name="pencil" size={14} className="text-gray-500" />
                    Edit policy
                  </Button>
                </div>
              </div>

              {/* ── Policy List Container ── */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 sm:p-8 space-y-6">
                {/* Row 1 — Early cancellation */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Early cancellation
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      All bookings must be paid before access is granted
                    </span>
                  </div>
                  <Switch
                    checked={policies.earlyCancellation}
                    onCheckedChange={(checked) =>
                      setPolicies((prev) => ({ ...prev, earlyCancellation: checked }))
                    }
                  />
                </div>

                {/* Row 2 — Late cancellation */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Late cancellation
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Weekly renewals locked if not paid by this time
                    </span>
                  </div>
                  <Switch
                    checked={policies.lateCancellation}
                    onCheckedChange={(checked) =>
                      setPolicies((prev) => ({ ...prev, lateCancellation: checked }))
                    }
                  />
                </div>

                {/* Row 3 — Auto-send Thursday reminders */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Auto-send Thursday reminders
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Automatically remind clients with due payments every Thursday
                    </span>
                  </div>
                  <Switch
                    checked={policies.thursdayReminders}
                    onCheckedChange={(checked) =>
                      setPolicies((prev) => ({ ...prev, thursdayReminders: checked }))
                    }
                  />
                </div>

                {/* Row 4 — Auto-lock overdue spaces */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Auto-lock overdue spaces
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Flag spaces for locking after Friday 6 PM if unpaid
                    </span>
                  </div>
                  <Switch
                    checked={policies.lockOverdueSpaces}
                    onCheckedChange={(checked) =>
                      setPolicies((prev) => ({ ...prev, lockOverdueSpaces: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* SPACE SETTINGS VIEW */}
          {activeTab === "space" && (
            <div className="max-w-[720px] space-y-6">
              {/* Header */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[24px] p-5 flex items-center justify-between">
                <span className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight">
                  Space settings
                </span>
              </div>

              {/* Toggles + notice card */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 sm:p-8 space-y-6">

                {/* Row 1 — Show live availability */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Show live availability to users
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Users can see which spaces are available in real time on the listing page
                    </span>
                  </div>
                  <Switch
                    checked={spaceSettings.liveAvailability}
                    onCheckedChange={(checked) =>
                      setSpaceSettings((prev) => ({ ...prev, liveAvailability: checked }))
                    }
                  />
                </div>

                {/* Row 2 — Allow same-day bookings */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Allow same-day bookings
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Users can book a space for the same day it&apos;s available
                    </span>
                  </div>
                  <Switch
                    checked={spaceSettings.sameDayBookings}
                    onCheckedChange={(checked) =>
                      setSpaceSettings((prev) => ({ ...prev, sameDayBookings: checked }))
                    }
                  />
                </div>

                {/* Row 3 — Show pricing on listing cards */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Show pricing on listing cards
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Display &ldquo;from ₦X&rdquo; on search results — turn off to require inquiry first
                    </span>
                  </div>
                  <Switch
                    checked={spaceSettings.showPricing}
                    onCheckedChange={(checked) =>
                      setSpaceSettings((prev) => ({ ...prev, showPricing: checked }))
                    }
                  />
                </div>

                {/* Row 4 — Minimum booking notice */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                      Minimum booking notice
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Require users to book at least this far in advance
                    </span>
                  </div>
                  <Select value={bookingNotice} onValueChange={setBookingNotice}>
                    <SelectTrigger
                      className="rounded-full border border-gray-200 dark:border-gray-700 bg-[#F2F2F7] dark:bg-gray-800 h-10 px-4 text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[140px] gap-2 focus-visible:ring-ring"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[18px] shadow-lg border border-gray-100 dark:border-gray-800 py-2 min-w-[200px]">
                      <SelectItem value="no-minimum" className="text-sm font-medium py-3 px-4 rounded-xl">
                        No minimum
                      </SelectItem>
                      <SelectItem value="24-hours" className="text-sm font-medium py-3 px-4 rounded-xl">
                        24 hours
                      </SelectItem>
                      <SelectItem value="48-hours" className="text-sm font-medium py-3 px-4 rounded-xl">
                        48 hours
                      </SelectItem>
                      <SelectItem value="1-week" className="text-sm font-medium py-3 px-4 rounded-xl">
                        1 week
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>
          )}
          {/* NOTIFICATIONS VIEW */}
          {activeTab === "notifications" && (
            <div className="max-w-[720px] space-y-6">
              {/* Header */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[24px] p-5 flex items-center justify-between">
                <span className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight">
                  Notifications
                </span>
              </div>

              {/* Toggles card */}
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 sm:p-8 space-y-6">
                {isNotificationsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={cn("flex items-center justify-between", i < 3 && "pb-6 border-b border-gray-100 dark:border-gray-800")}>
                      <div className="space-y-2 flex-1 pr-4">
                        <Skeleton className="h-4 w-40 rounded-full" />
                        <Skeleton className="h-3 w-56 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                  ))
                ) : (
                  <>
                    {/* Row 1 — New inquiry alerts */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">New inquiry alerts</span>
                        <span className="text-[13px] text-gray-500 dark:text-gray-400">Notify on new form submission</span>
                      </div>
                      <Switch
                        checked={notifications.newInquiryAlerts}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newInquiryAlerts: checked }))}
                      />
                    </div>

                    {/* Row 2 — Payment confirmations */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">Payment confirmations</span>
                        <span className="text-[13px] text-gray-500 dark:text-gray-400">Alert when a payment is received</span>
                      </div>
                      <Switch
                        checked={notifications.paymentConfirmations}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, paymentConfirmations: checked }))}
                      />
                    </div>

                    {/* Row 3 — Overdue warnings */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">Overdue warnings</span>
                        <span className="text-[13px] text-gray-500 dark:text-gray-400">Alert on Friday if payment not received</span>
                      </div>
                      <Switch
                        checked={notifications.overdueWarnings}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, overdueWarnings: checked }))}
                      />
                    </div>

                    {/* Row 4 — Daily schedule digest */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">Daily schedule digest</span>
                        <span className="text-[13px] text-gray-500 dark:text-gray-400">Morning summary of today&apos;s clients</span>
                      </div>
                      <Switch
                        checked={notifications.dailyScheduleDigest}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, dailyScheduleDigest: checked }))}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Save button */}
              {!isNotificationsLoading && (
                <Button
                  type="button"
                  loading={isSavingNotifications}
                  disabled={isSavingNotifications}
                  onClick={async () => {
                    try {
                      await updateNotifications(notifications)
                      toast.success("Notification settings saved")
                    } catch {
                      toast.error("Failed to save notification settings")
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary-600 text-white font-bold rounded-full h-[48px] transition-all cursor-pointer select-none"
                >
                  Save changes
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile: Change Password dialog */}

      {/* Team: Invite Teammate dialog */}
      <InviteTeammateDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />

      {/* Team: View Permissions Dialog */}
      <ViewPermissionsDialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen} />

      {/* Team: View Roles Dialog */}
      <ViewRolesDialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen} />

      {/* Policy: Add Payment Policy dialog */}
      <PaymentPolicyDialog
        open={isAddPolicyOpen}
        onOpenChange={setIsAddPolicyOpen}
        onSubmit={({ title, description }) => {
          toast.success(`Payment policy "${title}" created`)
        }}
      />

      {/* Policy: Edit Payment Policy dialog */}
      <PaymentPolicyDialog
        open={isEditPolicyOpen}
        onOpenChange={setIsEditPolicyOpen}
        policy={null}
        onSubmit={({ title, description }) => {
          toast.success(`Payment policy updated`)
        }}
      />
    </div>
  )
}
