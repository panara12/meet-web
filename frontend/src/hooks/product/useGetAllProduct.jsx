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

export function useGetAllProductCountByCompany(companyId) {
  return useQuery({
    queryKey:["AllProducts", companyId],
    queryFn:()=>productServices.getAllProductListByCompany(companyId),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}