import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { communicationService } from "../services/communication-service"
import type { Campaign } from "../types"

export function useCampaigns() {
  return useQuery<Campaign[], Error>({
    queryKey: ["communication", "campaigns"],
    queryFn: () => communicationService.getCampaigns(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
  })
}

export function useSaveCampaign() {
  const queryClient = useQueryClient()
  return useMutation<Campaign, Error, Omit<Campaign, "id" | "createdAt"> & { id?: string }>({
    mutationFn: (campaign) => communicationService.saveCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communication", "campaigns"] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation<string, Error, string>({
    mutationFn: (id) => communicationService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communication", "campaigns"] })
    },
  })
}
