import { useQueryClient, useMutation } from "@tanstack/react-query";
import cartServices from "../../services/cartService";

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartServices.updateCart,
    onSuccess: (res) => {
        queryClient.invalidateQueries(['GetAllCarts']); 
    }
  });
}
