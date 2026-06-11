import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { spacesMockService } from "../services/spaces-mock.service"
import type { CreateSpaceInput } from "../types"
import type { SpaceFilters } from "../components/spaces-filter-popover"

export function useSpacesSummary() {
  return useQuery({
    queryKey: ["spaces-summary"],
    queryFn: () => spacesMockService.getSummary(),
  })
}

export function useSpacesList(page = 1, filters?: SpaceFilters) {
  return useQuery({
    queryKey: ["spaces-list", page, filters],
    queryFn: () => spacesMockService.getSpaces(page, filters),
  })
}

export function useCreateSpace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSpaceInput) => spacesMockService.createSpace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces-list"] })
      queryClient.invalidateQueries({ queryKey: ["spaces-summary"] })
    },
  })
}

export function useSpaceDetail(id: string) {
  return useQuery({
    queryKey: ["space-detail", id],
    queryFn: () => spacesMockService.getSpaceById(id),
    enabled: !!id,
  })
}
