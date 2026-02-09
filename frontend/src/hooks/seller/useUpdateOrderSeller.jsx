import { useQueryClient, useMutation } from "@tanstack/react-query";
import sellerServices from "../../services/clientService";

export function useUpdateOrderSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sellerServices.updateOrderSeller,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllSeller']); 
    }
  });
}
