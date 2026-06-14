import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsService } from "../services/settings-service"
import type { UserProfile, Teammate, TeammateFilters } from "../types"

export function useProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["settings", "profile"],
    queryFn: () => settingsService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation<UserProfile, Error, UserProfile>({
    mutationFn: (profile) => settingsService.updateProfile(profile),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", "profile"], data)
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] })
    },
  })
}

export function useChangePassword() {
  return useMutation<void, Error, { currentPassword?: string; newPassword?: string }>({
    mutationFn: ({ currentPassword, newPassword }) =>
      settingsService.changePassword(currentPassword || "", newPassword || ""),
  })
}

export function useTeammatesList(page = 1, filters?: TeammateFilters) {
  return useQuery({
    queryKey: ["settings", "teammates", page, filters],
    queryFn: () => settingsService.getTeammates(page, filters),
  })
}

export function useInviteTeammate() {
  const queryClient = useQueryClient()
  return useMutation<Teammate, Error, Omit<Teammate, "id" | "avatar" | "status" | "dateJoined">>({
    mutationFn: (teammate) => settingsService.inviteTeammate(teammate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "teammates"] })
    },
  })
}
