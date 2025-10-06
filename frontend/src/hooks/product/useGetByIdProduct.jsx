import { useQuery } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useGetByIdProduct() {
  return useQuery({
    queryKey:["singleProducts"],
    queryFn:()=>productServices.getProductById(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
