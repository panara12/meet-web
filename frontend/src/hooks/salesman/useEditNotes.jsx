import { useMutation, useQueryClient } from "@tanstack/react-query";
import salesmanService from "../../services/salesmanService";

export function useEditNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesmanService.editNotes,
    onSuccess: (res) => {
        queryClient.invalidateQueries(['SalesmanNotes']); // or your actual query key
    }
  });
}
