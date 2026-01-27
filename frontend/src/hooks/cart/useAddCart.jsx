import { useQueryClient, useMutation } from "@tanstack/react-query";
import cartServices from "../../services/cartService";

export function useAddCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartServices.addToCart,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllCarts']); 
    },
    refetchOnMount: true
  });
}
