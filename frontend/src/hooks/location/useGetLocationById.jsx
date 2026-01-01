import { useMutation } from "@tanstack/react-query"
import locationServices from "../../services/locationService"

export function useGetLocationById() {
  return useMutation({
    mutationFn: ({ userId }) => {
      if (!userId) {
        throw new Error("User ID is required")
      }
      return locationServices.GetLocationByUserId({userId})
    },
  })
}
