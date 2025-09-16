import { useMutation, useQueryClient } from "@tanstack/react-query";
import salesmanService from "../../services/salesmanService";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesmanService.deleteNotes, // assumes this function accepts an ID or note object
    onSuccess: () => {
      queryClient.invalidateQueries(['SalesmanNotes']); // invalidate to refetch updated list
    },
  });
}
