import { useQueryClient, useMutation } from "@tanstack/react-query";
import orderServices from "../../services/orderService";

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderServices.updateOrders,
    onSuccess: (res) => {
        queryClient.invalidateQueries(['getAllOrders']); 
    }
  });
}
