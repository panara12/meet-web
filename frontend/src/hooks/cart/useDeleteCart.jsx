import { useQueryClient, useMutation } from "@tanstack/react-query";
import cartServices from "../../services/cartService";

export function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartServices.deleteCart,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllCarts']); 
    }
  });
}
