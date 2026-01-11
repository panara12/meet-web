import { useQueryClient, useMutation } from "@tanstack/react-query";
import paymentServices from "../../services/paymentService";

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentServices.UpdatePaymentStatus,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllPayment']); 
    }
  });
}
