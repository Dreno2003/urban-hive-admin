"use client"

import React, { useState, useEffect } from "react"
import { useCampaigns, useSaveCampaign, useDeleteCampaign } from "../hooks/use-campaigns"
import { CampaignFilterPopover } from "./campaign-filter-popover"
import { AddEditCampaignDialog } from "./add-edit-campaign-dialog"
import { DraftsListDialog } from "./drafts-list-dialog"
import { Pagination } from "@/shared/components/ui/pagination"
import { Button } from "@/shared/components/ui/button"
import { Icon } from "@/shared/components/ui/icon"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Separator } from "@/shared/components/ui/separator"
import type { Campaign, CampaignFilters } from "../types"
import { sonnerCard } from "@/shared/components/ui/sonner-card"

const EMPTY_FILTERS: CampaignFilters = {
  categories: [],
  dateFrom: "",
  dateTo: "",
}

const ITEMS_PER_PAGE = 2

export function CommunicationContent() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<CampaignFilters>(EMPTY_FILTERS)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDraftsDialogOpen, setIsDraftsDialogOpen] = useState(false)

  const { data: campaigns = [], isLoading } = useCampaigns()
  const { mutateAsync: saveCampaign } = useSaveCampaign()
  const { mutateAsync: deleteCampaign } = useDeleteCampaign()

  // Reset page when switching filters
  useEffect(() => {
    setPage(1)
  }, [filters])

  // Filter live campaigns for main view
  const liveCampaigns = React.useMemo(() => {
    return campaigns.filter((camp) => camp.status === "live")
  }, [campaigns])

  // Filter draft campaigns for drafts dialog view
  const draftCampaigns = React.useMemo(() => {
    return campaigns.filter((camp) => camp.status === "draft")
  }, [campaigns])

  // Filter live campaigns by filter selections
  const filteredLiveCampaigns = React.useMemo(() => {
    return liveCampaigns
      .filter((camp) => {
        // Filter by category
        if (filters.categories.length > 0) {
          return filters.categories.includes(camp.category)
        }
        return true
      })
      .filter((camp) => {
        // Filter by date range
        const createdAtDate = new Date(camp.createdAt)
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          fromDate.setHours(0, 0, 0, 0)
          if (createdAtDate < fromDate) return false
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          toDate.setHours(23, 59, 59, 999)
          if (createdAtDate > toDate) return false
        }
        return true
      })
  }, [liveCampaigns, filters])

  // Paginated live campaigns
  const displayedLiveCampaigns = React.useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return filteredLiveCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredLiveCampaigns, page])

  const totalPages = Math.max(1, Math.ceil(filteredLiveCampaigns.length / ITEMS_PER_PAGE))

  const handleCreateNew = () => {
    setSelectedCampaign(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsDialogOpen(true)
  }

  const handleEditDraft = (draft: Campaign) => {
    setSelectedCampaign(draft)
    setIsDraftsDialogOpen(false)
    setIsDialogOpen(true)
  }

  const handleFormSubmit = async (values: Omit<Campaign, "id" | "createdAt"> & { id?: string }) => {
    try {
      const isEditing = !!values.id
      await saveCampaign(values)
      sonnerCard.success(
        isEditing
          ? `Campaign "${values.title}" updated successfully.`
          : values.status === "live"
          ? `Campaign "${values.title}" published successfully.`
          : `Campaign "${values.title}" saved to drafts.`
      )
      setIsDialogOpen(false)
    } catch {
      sonnerCard.failed("Something went wrong. Please try again.")
    }
  }

  const handleCampaignDelete = async (id: string) => {
    try {
      await deleteCampaign(id)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full px-8 md:px-12 pt-8 pb-12 mt-[76px]">
        {/* ── Page Header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight">Communication</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Campaigns, newsletters, and member communications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsDraftsDialogOpen(true)}
              variant="secondary-outline"
              className="rounded-full h-[42px] px-5 text-gray-700 dark:text-gray-300 dark:border-gray-800 text-sm cursor-pointer transition-colors bg-[#F2F2F7] hover:bg-gray-150 dark:bg-gray-800 dark:hover:bg-gray-750"
            >
              View drafts
            </Button>
            <Button
              onClick={handleCreateNew}
              className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2 cursor-pointer transition-colors"
            >
              <Icon name="plus" size={15} />
              New campaign
            </Button>
          </div>
        </div>

        {/* ── Main List Container ────────────────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[28px] flex flex-col min-h-[400px]">
          {/* List Header */}
          <div className="flex p-6 items-center justify-between">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
              Live campaigns
            </h4>
            <CampaignFilterPopover value={filters} onChange={setFilters} />
          </div>
          <Separator />

          {/* List Content */}
          <div className="flex-1 flex flex-col justify-between">
            {isLoading ? (
              <div className="p-6 space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-gray-900">
                    <div className="space-y-2 flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-1/3 bg-gray-100 dark:bg-gray-800" />
                        <Skeleton className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded-md" />
                      </div>
                      <Skeleton className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredLiveCampaigns.length === 0 ? (
              <div className="flex-1 flex p-6 flex-col items-center justify-center py-16 gap-3">
                <Icon name="flagFill" size={80} className="text-gray-400 dark:text-gray-500" />
                <p className="text-[18px] font-semibold text-gray-900 dark:text-white">
                  No live campaigns
                </p>
                <p className="text-sm text-secondary-foreground dark:text-gray-500">
                  Campaigns you create will appear here
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="rounded-full h-[42px] px-5 bg-primary text-white hover:bg-primary/90 text-sm font-medium gap-2 cursor-pointer transition-colors mt-2"
                >
                  <Icon name="plus" size={15} />
                  New campaign
                </Button>
              </div>
            ) : (
              <div>
                <div className="p-6 divide-y divide-gray-100 dark:divide-gray-800">
                  {displayedLiveCampaigns.map((camp) => (
                    <div key={camp.id} className="border-b last:border-b-0 flex justify-between items-center py-5 gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2.5">
                          <h5 className="text-body-base font-medium text-gray-900 dark:text-white truncate">
                            {camp.title}
                          </h5>
                          <span className="px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-transparent text-[#6D7280] dark:text-gray-400 text-body-sm font-medium tracking-wide">
                            {camp.category}
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1 pr-6">
                          {camp.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditClick(camp)}
                        type="button"
                        className="flex items-center gap-1.5 h-[32px] px-3.5 rounded-full bg-[#F2F2F7] dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer border-0 transition-all shrink-0"
                      >
                        <Icon name="pencil" size={12} className="text-gray-500 dark:text-gray-400" />
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination footer */}
            {filteredLiveCampaigns.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-900 mt">
                <div className="px-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    variant="default"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddEditCampaignDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        campaign={selectedCampaign}
        onSubmit={handleFormSubmit}
        onDelete={handleCampaignDelete}
      />

      <DraftsListDialog
        open={isDraftsDialogOpen}
        onOpenChange={setIsDraftsDialogOpen}
        drafts={draftCampaigns}
        onEditDraft={handleEditDraft}
      />
    </div>
  )
}
