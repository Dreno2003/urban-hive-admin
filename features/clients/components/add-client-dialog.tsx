"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import countryList from "country-codes-list"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Icon } from "@/shared/components/ui/icon"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"
import { sonnerCard } from "@/shared/components/ui/sonner-card"

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(7, "Phone number is too short")
    .required("Phone number is required"),
})

const FlagImage = ({ code, name, className }: { code: string; name: string; className?: string }) => (
  <div className={cn("relative shrink-0 overflow-hidden rounded-full border border-gray-100", className)}>
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
      className="absolute inset-0 h-full w-full object-cover"
      alt={name}
    />
  </div>
)

export interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: { fullName: string; email: string; phone: string }) => void | Promise<void>
  loading?: boolean
}

export function AddClientDialog({ open, onOpenChange, onSubmit, loading }: AddClientDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const countryArray = useMemo(() =>
    countryList.all().map((c: any) => ({
      code: c.countryCode,
      name: c.countryNameEn,
      callingCode: `+${c.countryCallingCode}`,
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))
  , [])

  const filteredCountries = useMemo(() =>
    countryArray.filter((c: any) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.callingCode.includes(searchQuery)
    )
  , [countryArray, searchQuery])

  const defaultCountry = countryArray.find((c: any) => c.code === "NG") || countryArray[0]
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)

  const formik = useFormik({
    initialValues: { fullName: "", email: "", phoneNumber: "" },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      // sonnerCard.info
      await onSubmit?.({
        fullName: values.fullName,
        email: values.email,
        phone: `${selectedCountry.callingCode}${values.phoneNumber}`,
      })
    },
  })

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      formik.resetForm()
      setSearchQuery("")
      setSelectedCountry(defaultCountry)
    }
    onOpenChange(v)
  }

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] ? formik.errors[field] : undefined

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleOpenChange}
      dialogTitle="Add new client"
      isShowTopSeparator={false}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5 mt-4 pb-2">

        {/* Full name + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-500">Client full name</label>
            <Input
              name="fullName"
              placeholder="Enter client full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("fullName")}
              className="h-[46px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-500">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter client email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={err("email")}
              className="h-[46px]"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-500">Client phone number</label>
          <div className="relative flex items-center w-full">
            <DropdownMenu onOpenChange={(open) => !open && setSearchQuery("")}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="absolute left-3 z-10 flex items-center gap-1.5 border-r border-gray-200 pr-2 h-8 focus:outline-none"
                >
                  <FlagImage code={selectedCountry.code} name={selectedCountry.name} className="size-5" />
                  <span className="text-sm font-medium text-gray-600">{selectedCountry.callingCode}</span>
                  <Icon name="chevronDown" size={14} className="text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] p-0" sideOffset={12}>
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Icon name="search" className="absolute z-10 left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      placeholder="Search country..."
                      className="h-[35px] pl-9 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <ScrollArea className="h-72">
                  <div className="p-1">
                    {filteredCountries.map((country: any) => (
                      <DropdownMenuItem
                        key={`${country.code}-${country.callingCode}`}
                        onClick={() => setSelectedCountry(country)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:!bg-secondary"
                      >
                        <FlagImage code={country.code} name={country.name} className="size-5" />
                        <span className="text-sm font-medium flex-1 truncate">{country.name}</span>
                        <span className="text-sm text-gray-500">{country.callingCode}</span>
                      </DropdownMenuItem>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">No country found.</div>
                    )}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              name="phoneNumber"
              type="tel"
              autoComplete="off"
              placeholder="Enter phone number"
              className="pl-28"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // error={err("phoneNumber")}
            />

          </div>
            <p className="text-red-500 text-xs font-medium">{err("phoneNumber")}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => handleOpenChange(false)}
            className="h-[50px] flex-1 rounded-full text-[14px]"
            disabled={formik.isSubmitting || loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={formik.isSubmitting || loading}
            className="h-[50px] flex-1 rounded-full text-[14px] bg-primary text-white hover:bg-primary/90"
          >
            Add client
          </Button>
        </div>
      </form>
    </DialogContainer>
  )
}

export default AddClientDialog
