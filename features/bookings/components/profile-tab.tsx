"use client";

import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";
import { toast } from "sonner";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useProfile, useUpdateProfile } from "../hooks/use-settings";

interface ProfileTabProps {
  dict: Dictionary;
  onChangePasswordClick: () => void;
}

export function ProfileTab({ dict, onChangePasswordClick }: ProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const settingsDict = (dict as any).settings || {};

  // Formik setup for profile
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      avatar: profile?.avatar || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(settingsDict.firstNameRequired || "First name is required"),
      lastName: Yup.string().required(settingsDict.lastNameRequired || "Last name is required"),
      email: Yup.string().email(settingsDict.invalidEmail || "Invalid email address").required(settingsDict.emailRequired || "Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateProfile(values);
        toast.success(settingsDict.profileUpdated || "Profile updated successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to update profile");
      }
    },
  });

  // Initials computation
  const getInitials = () => {
    const first = formik.values.firstName ? formik.values.firstName.charAt(0) : "F";
    const last = formik.values.lastName ? formik.values.lastName.charAt(0) : "O";
    return (first + last).toUpperCase();
  };

  // Avatar upload trigger
  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {isProfileLoading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
            <div className="w-24 h-8 rounded-full bg-gray-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-14 rounded-[32px] bg-gray-100 animate-pulse" />
            <div className="h-14 rounded-[32px] bg-gray-100 animate-pulse" />
          </div>
          <div className="h-14 rounded-[32px] bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="max-w-2xl  space-y-10">
          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            <div className="relative group size-24 shrink-0 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-purple-100 overflow-hidden shadow-inner">
              {formik.values.avatar ? (
                <img
                  src={formik.values.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getInitials()
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant={'secondary'}
              type="button"
              onClick={handleEditImageClick}
              className="rounded-full text-black py-[4px] border px-[17px] text-[13px]  transition-colors cursor-pointer"
            >
              {settingsDict.editImage || "Edit image"}
            </Button>
          </div>

          {/* Name fields */}
          <Separator />

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font text-gray-700 pl-1">
                  {settingsDict.firstNameLabel || "First name"}
                </label>
                <Input
                  name="firstName"
                  type="text"
                  className="h-[44px]"
                  placeholder={settingsDict.firstNamePlaceholder || "First name"}
                  icon={<Icon name="user" size={18} className="!text-icon-default" />}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && formik.errors.firstName}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font- text-gray-700 pl-1">
                  {settingsDict.lastNameLabel || "Last name"}
                </label>
                <Input
                  name="lastName"
                  type="text"
                  className="h-[44px]"
                  placeholder={settingsDict.lastNamePlaceholder || "Last name"}
                  icon={<Icon name="user" size={18} className="!text-icon-default" />}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && formik.errors.lastName}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font- text-gray-700 pl-1">
                {settingsDict.emailLabel || "Email"}
              </label>
              <Input
                name="email"
                type="email"
                className="h-[44px]"
                placeholder={settingsDict.emailPlaceholder || "friedaodagboyi@gmail.com"}
                icon={<Icon name="mail" size={18} className="!text-icon-default" />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <Button
            type="submit"
            loading={isUpdating}
            disabled={isUpdating || !formik.dirty}
            className="w-full bg-primary hover:bg-primary-600 text-white font-bold  rounded-full mt-2 h-[44px] transition-all"
          >
            {settingsDict.saveChanges || "Save changes"}
          </Button>

          <Separator />

          {/* Security Sub-section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {settingsDict.securitySection || "Security"}
              </h2>
              <button
                type="button"
                onClick={onChangePasswordClick}
                className="text-sm text-primary font hover:underline cursor-pointer"
              >
                {settingsDict.changePassword || "Change password"}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font text-gray-700 pl-1">
                {settingsDict.passwordLabel || "Password"}
              </label>
              <PasswordInput
                name="fakePassword"
                disabled
                isShowEndIcon={false}
                // value="xxxxxxxx"
                className="bg-[#F2F2F7]/60 passwo text-[30rem] cursor-not-allowed opacity-75 select-none"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
