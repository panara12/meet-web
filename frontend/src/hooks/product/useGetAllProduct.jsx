import { useQuery } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useGetAllProduct() {
  return useQuery({
    queryKey:["AllProducts"],
    queryFn:()=>productServices.getAllProductList(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
