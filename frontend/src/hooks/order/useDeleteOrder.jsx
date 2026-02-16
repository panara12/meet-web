import { useQueryClient, useMutation } from "@tanstack/react-query";
import orderServices from "../../services/orderService";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderServices.deleteOrders,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['getAllOrders']); 
    }
  });
}
