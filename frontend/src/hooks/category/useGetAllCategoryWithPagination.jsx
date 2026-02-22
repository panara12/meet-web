import { useQuery } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useGetAllCategoryWithPagination(params) {
  const { page = 1, limit = 10, search, status,category, companyId, sortField, sortDirection } = params || {};

  return useQuery({
    queryKey:["AllCategories", page, limit, search, status,category, companyId, sortField, sortDirection],
    queryFn:()=>categoryServices.getAllCategoryWithPagination({
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