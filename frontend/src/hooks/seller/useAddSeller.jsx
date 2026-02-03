import { useMutation, useQueryClient } from "@tanstack/react-query";
import sellerServices from "../../services/clientService";

export function useAddSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sellerServices.addSeller,
    onSuccess: (res) => {
        console.log(res); 
        queryClient.invalidateQueries(['GetAllSeller']); 
    }
  });
}
