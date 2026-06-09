import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { onboardingService } from "../services/onboarding-service"
import { OnboardingGuide } from "../types"

export function useOnboardingGuides() {
  return useQuery<OnboardingGuide[], Error>({
    queryKey: ["onboarding", "guides"],
    queryFn: () => onboardingService.getGuides(),
    staleTime: 5 * 60 * 1000, // 5 minutes caching stale time
  })
}

export function useSaveOnboardingGuide() {
  const queryClient = useQueryClient()
  return useMutation<OnboardingGuide, Error, OnboardingGuide>({
    mutationFn: (guide) => onboardingService.saveGuide(guide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "guides"] })
    },
  })
}

export function useDeleteOnboardingGuide() {
  const queryClient = useQueryClient()
  return useMutation<string, Error, string>({
    mutationFn: (id) => onboardingService.deleteGuide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "guides"] })
    },
  })
}
