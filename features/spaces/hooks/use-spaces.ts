import { useQuery } from "@tanstack/react-query"
import { spacesMockService } from "../services/spaces-mock.service"

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
