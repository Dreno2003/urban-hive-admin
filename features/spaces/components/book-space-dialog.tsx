"use client"

import React, { useState, useMemo } from "react"
import { DialogContainer } from "@/shared/components/dialogs/dialog-container"
import { Icon } from "@/shared/components/ui/icon"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

interface BookSpaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectClient: (clientName: string, clientId: string) => void
}

const WHICH_CLIENTS_MOCK = [
  { id: "10002", name: "Adaeze Okanwo" },
  { id: "10003", name: "Adaeze Okonwo" },
  { id: "10002", name: "Adaeze Okanwo" },
  { id: "10002", name: "Adaeze Okanwo" },
  { id: "10002", name: "Adaeze Okanwo" },
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
      dialogTitle="Which client?"
      isShowTopSeparator={false}
      contentClassName="sm:max-w-[440px]"
      className="pb-4"
    >
      <p className="text-xs text-gray-400 font-semibold -mt-2.5 mb-2">
        Select the client this booking is being made for
      </p>

      {/* Search bar inside dialog */}
      <div className="py-2">
        <Input
          icon={<Icon name="search" size={18} className="text-gray-400" />}
          type="text"
          placeholder="Search client name or id"
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="w-full h-[40px] pl-10 rounded-full border border-gray-100 focus:ring-1 focus:ring-primary/20 bg-gray-50/50"
        />
      </div>

      {/* List of clients */}
      <div className="max-h-[260px] overflow-y-auto pr-1 flex flex-col divide-y divide-gray-50 dark:divide-gray-850">
        {filteredClients.length === 0 ? (
          <p className="text-center py-6 text-sm text-gray-400 italic">No clients found</p>
        ) : (
          filteredClients.map((client, i) => {
            const actualSelected = selectedClientId === `${client.id}-${i}`
            const isChecked = actualSelected || (selectedClientId === null && client.id === "10003")

            return (
              <div
                key={`${client.id}-${i}`}
                onClick={() => handleSelect(client.name, actualSelected ? "" : `${client.id}-${i}`)}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[14px] text-gray-800 dark:text-gray-200",
                    isChecked ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-600"
                  )}>
                    {client.name}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    ID {client.id}
                  </span>
                </div>

                {isChecked && (
                  <Icon
                    name="check"
                    size={18}
                    className="text-primary shrink-0 transition-transform duration-200 scale-100"
                  />
                )}
              </div>
            )
          })
        )}
      </div>
    </DialogContainer>
  )
}
