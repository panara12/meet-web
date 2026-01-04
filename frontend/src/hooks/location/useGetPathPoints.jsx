import { useMutation } from "@tanstack/react-query"
import locationServices from "../../services/locationService"

export function useGetpathPoints() {
  return useMutation({
    mutationFn: ({ date,userId }) => {
      if (!userId && !date) {
        throw new Error("User ID and Date are required")
      }
      return locationServices.GetPathPointsByUserId({date,userId})
    },
  })
}
