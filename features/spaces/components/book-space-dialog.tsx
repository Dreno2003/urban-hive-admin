"use client"

import React, { useState, useMemo } from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { Input } from "@/shared/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { cn } from "@/shared/lib/utils"

interface BookSpaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectClient: (clientName: string, clientId: string) => void
}

const WHICH_CLIENTS_MOCK = [
  { id: "10002", name: "Adaeze Okonwo" },
  { id: "10003", name: "Adaeze Okonwo" },
  { id: "10002", name: "Adaeze Okonwo" },
  { id: "10002", name: "Adaeze Okonwo" },
  { id: "10002", name: "Adaeze Okonwo" },
  { id: "10004", name: "Funmi Adeyemi" },
  { id: "10005", name: "James Matthew" },
]

export function BookSpaceDialog({
  open,
  onOpenChange,
  onSelectClient,
}: BookSpaceDialogProps) {
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const filteredClients = useMemo(() => {
    return WHICH_CLIENTS_MOCK.filter(
      (c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.id.includes(clientSearch)
    )
  }, [clientSearch])

  const handleSelect = (clientName: string, clientId: string) => {
    setSelectedClientId(clientId)
    onSelectClient(clientName, clientId)
    setTimeout(() => {
      setSelectedClientId(null)
      setClientSearch("")
    }, 600)
  }

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle={
        <span className="text-[26px] font-semibold text-[#1F2937] dark:text-white tracking-tight">
          Which client?
        </span>
      }
      isShowTopSeparator={false}
      contentClassName="sm:max-w-[540px] rounded-[28px] md:!rounded-[32px] px-0"
      className="pb-2"
    >
      <p className="text-[15px] text-secondary-foreground mt-2 mb-5 font-normal leading-normal">
        Select the client this booking is being made for
      </p>

      {/* Search bar inside dialog */}
      <div className="mb-4">
        <Input
          icon={<Icon name="search" size={16} className="text-icon-default" />}
          type="text"
          placeholder="Search client name or id"
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="w-full  pl-10 rounded-full border-none bg-[#F2F2F7] dark:bg-gray-800 text-[15px] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:border-none shadow-none"
        />
      </div>

      {/* List of clients */}
      <RadioGroup
        value={selectedClientId || "10003-1"}
        onValueChange={(val) => {
          const clientIndex = parseInt(val.split("-")[1], 10)
          const client = filteredClients[clientIndex]
          if (client) {
            handleSelect(client.name, val)
          }
        }}
        className="max-h-[320px] overflow-y-auto pr-1 flex flex-col divide-y divide-gray-100 dark:divide-gray-800 custom-scrollbar gap-0"
      >
        {filteredClients.length === 0 ? (
          <p className="text-center py-6 text-sm text-gray-400 italic">No clients found</p>
        ) : (
          filteredClients.map((client, i) => {
            const clientVal = `${client.id}-${i}`
            const isChecked = (selectedClientId === null && client.id === "10003" && i === 1) || selectedClientId === clientVal

            return (
              <label
                key={clientVal}
                className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50/20 dark:hover:bg-gray-800/20 px-1 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[16px] text-[#1F2937] dark:text-gray-200 tracking-tight",
                    isChecked ? "font-bold text-[#1F2937] dark:text-white" : "font-normal text-[#1F2937]/80 dark:text-gray-300"
                  )}>
                    {client.name}
                  </span>
                  <span className="bg-[#F2F2F7] dark:bg-gray-800 text-[#8E8E93] dark:text-gray-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    ID {client.id}
                  </span>
                </div>

                <RadioGroupItem value={clientVal} checked={isChecked} />
              </label>
            )
          })
        )}
      </RadioGroup>
    </DialogContainer>
  )
}
