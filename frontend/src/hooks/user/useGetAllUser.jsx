import { useQuery } from '@tanstack/react-query'
import userServices from '../../services/userService'

export function useGetAllUser(params) {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    status, 
    department, 
    role, 
    sortField, 
    sortDirection 
  } = params || {};

  return useQuery({
    queryKey: [
      "GetAllUser", 
      page, 
      limit, 
      search, 
      status, 
      department, 
      role, 
      sortField, 
      sortDirection
    ],
    queryFn: () => userServices.getAllUser({ 
      page, 
      limit, 
      search, 
      status, 
      department, 
      role, 
      sortField, 
      sortDirection 
    }),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  })
}