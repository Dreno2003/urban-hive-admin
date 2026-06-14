"use client"

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Icon } from "@/shared/components/ui/icon"
import { NotificationCard } from "@/shared/components/ui/notification-card"
import { useInviteTeammate } from "../hooks/use-settings"
import { toast } from "sonner"

interface InviteTeammateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const inviteSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  role: Yup.string()
    .oneOf(["Administrator", "Manager", "Staff"], "Invalid role selected")
    .required("Role selection is required"),
})

export function InviteTeammateDialog({ open, onOpenChange }: InviteTeammateDialogProps) {
  const { mutateAsync: inviteTeammate, isPending } = useInviteTeammate()

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      role: "" as any, // Start with empty to show placeholder
    },
    validationSchema: inviteSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const nameParts = values.fullName.trim().split(/\s+/)
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""

        await inviteTeammate({
          firstName,
          lastName,
          email: values.email,
          role: values.role,
        })

        toast.success(`Invitation sent to ${values.fullName}`)
        resetForm()
        onOpenChange(false)
      } catch (err: any) {
        toast.error(err.message || "Failed to send invitation")
      }
    },
  })

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm()
    }
    onOpenChange(isOpen)
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleClose}
      dialogTitle="Invite team member"
      isShowTopSeparator
      contentClassName="sm:max-w-[580px] px-0"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
        {/* Name input */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Name
          </label>
          <Input
            name="fullName"
            type="text"
            placeholder="Enter full name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && formik.errors.fullName}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        {/* Role selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Role
          </label>
          <div className="relative">
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="flex h-[44px] w-full rounded-[32px] bg-secondary px-[16px] py-[12px] text-xs md:text-[15px] border-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none text-gray-900 dark:text-white cursor-pointer select-none"
            >
              <option value="" disabled hidden>
                Select teammate role
              </option>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Administrator">Administrator</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <Icon name="chevronDown" size={16} />
            </div>
          </div>
          {formik.touched.role && formik.errors.role && (
            <p className="mt-2 text-xs font-medium text-destructive ml-3 animate-in fade-in duration-200">
              {formik.errors.role}
            </p>
          )}
        </div>

        {/* Email input */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5 ml-1">
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="Enter teammate email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
            className="bg-secondary border-transparent focus-visible:ring-ring h-[44px]"
          />
        </div>

        {/* Info Notification Card */}
        <div className="pt-2">
          <NotificationCard
            variant="dark"
            type="info"
            title="Your teammate will receive a link via email to join and set up their password"
            className="max-w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleClose(false)}
            className="rounded-full h-11 text-sm bg-secondary hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            className="rounded-full h-11 text-sm bg-primary text-white hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Add teammate
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}
