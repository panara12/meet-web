import { useMutation, useQueryClient } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productServices.deleteProduct,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllProducts']); 
    }
  });
}
