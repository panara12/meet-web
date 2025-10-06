import { useQuery } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useDeleteProduct() {
  return useQuery({
    queryKey:["AllProducts"],
    queryFn:()=>productServices.deleteProduct(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
