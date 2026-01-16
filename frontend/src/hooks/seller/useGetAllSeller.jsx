import { useQuery } from '@tanstack/react-query'
import sellerServices from '../../services/clientService'

export function useGetAllSeller(params) {
  const { page = 1, limit = 10, search, status, priority, sortField, sortDirection } = params || {};
  
  return useQuery({
    queryKey: ["GetAllSeller", page, limit, search, status, priority, sortField, sortDirection],
    queryFn: () => sellerServices.getSellerList({
      page,
      limit,
      search,
      status,
      priority,
      sortField,
      sortDirection
    }),
    onSuccess: (res) => {
      return res.data;
    },
    keepPreviousData: true, // Keep previous data while fetching new data
  })
}