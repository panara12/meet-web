import { useMutation } from "@tanstack/react-query";
import sellerServices from "../../services/sellerService";

export function useAddSeller() {

  return useMutation({
    mutationFn: sellerServices.addSeller
  });
}
