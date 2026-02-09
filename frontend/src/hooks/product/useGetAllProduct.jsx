import { useQuery } from '@tanstack/react-query'
import productServices from '../../services/productService'

export function useGetAllProduct(params) {
  const { page = 1, limit = 10, search, status,category, companyId, sortField, sortDirection } = params || {};

  return useQuery({
    queryKey:["AllProducts", page, limit, search, status,category, companyId, sortField, sortDirection],
    queryFn:()=>productServices.getAllProductList({
      page,
      limit,
      search,
      status,
      category,
      companyId,
      sortField,
      sortDirection
    }),
    onSuccess:(res)=>{
        return res.data;
    },
    keepPreviousData: true,
    staleTime: 30000,
  })
}

export function useGetAllProductCountByCompany(companyId) {
  return useQuery({
    queryKey:["AllProducts", companyId],
    queryFn:()=>productServices.getAllProductListByCompany(companyId),
    onSuccess:(res)=>{
        return res.data;
    },
    staleTime: 60000, // 1 minute
  })
}