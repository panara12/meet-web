import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productServices.updateProduct,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllProducts']); 
    }
  });
}
