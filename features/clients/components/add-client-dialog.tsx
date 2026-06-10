"use client"

import React, { useState, useMemo } from "react"
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
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const countryArray = useMemo(() => {
    return countryList.all().map((c: any) => ({
      code: c.countryCode,
      name: c.countryNameEn,
      callingCode: `+${c.countryCallingCode}`,
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))
  }, [])

  const filteredCountries = useMemo(() =>
    countryArray.filter((c: any) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.callingCode.includes(searchQuery)
    ), [countryArray, searchQuery])

  const [selectedCountry, setSelectedCountry] = useState(
    () => countryArray.find((c: any) => c.code === "NG") || countryArray[0]
  )

  const reset = () => {
    setFullName(""); setEmail(""); setPhoneNumber(""); setSearchQuery("")
    setSelectedCountry(countryArray.find((c: any) => c.code === "NG") || countryArray[0])
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit?.({ fullName, email, phone: `${selectedCountry.callingCode}${phoneNumber}` })
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={handleOpenChange}
      dialogTitle="Add new client"
      isShowTopSeparator={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4 pb-2">

        {/* Full name + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-500">Client full name</label>
            <Input
              placeholder="Enter client full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-[46px]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-500">Email</label>
            <Input
              type="email"
              placeholder="Enter client email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[46px]"
              required
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
                  <div className="py-1">
                    {filteredCountries.map((country: any) => (
                      <DropdownMenuItem
                        key={`${country.code}-${country.callingCode}`}
                        onClick={() => setSelectedCountry(country)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer"
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
              type="tel"
              placeholder="Enter phone number"
              className="pl-28"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button
            type="button"
            variant="secondary-outline"
            onClick={() => handleOpenChange(false)}
            className="h-[50px] flex-1 rounded-full text-[14px]"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
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
