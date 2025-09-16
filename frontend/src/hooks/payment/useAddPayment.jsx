import { useMutation } from "@tanstack/react-query";
import paymentServices from "../../services/paymentService";

export function useAddPayment() {

  return useMutation({
    mutationFn: paymentServices.addPayment,
    onSuccess: (res) => {
      return res;
    }
  });
}
