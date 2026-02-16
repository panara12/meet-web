import { useMutation, useQueryClient } from "@tanstack/react-query";
import salesmanService from "../../services/salesmanService";

export function useAddNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesmanService.addNotes,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['SalesmanNotes']); // or your actual query key
    }
  });
}
