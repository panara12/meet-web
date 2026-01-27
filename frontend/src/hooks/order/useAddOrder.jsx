import { useQueryClient, useMutation } from "@tanstack/react-query";
import orderServices from "../../services/orderService";

export function useAddOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderServices.addOrders,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['getAllOrders']); 
    },
    refetchOnMount: true
  });
}
