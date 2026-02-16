import { useMutation, useQueryClient } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productServices.addProduct,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllProducts']); 
    }
  });
}
