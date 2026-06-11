import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { spacesMockService } from "../services/spaces-mock.service"
import type { CreateSpaceInput } from "../types"

export function useSpacesSummary() {
  return useQuery({
    queryKey: ["spaces-summary"],
    queryFn: () => spacesMockService.getSummary(),
  })
}

export function useSpacesList(page = 1) {
  return useQuery({
    queryKey: ["spaces-list", page],
    queryFn: () => spacesMockService.getSpaces(page),
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
