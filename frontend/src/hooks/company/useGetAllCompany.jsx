import { useQuery } from '@tanstack/react-query'
import companyServices from '../../services/companyServices'

export function useGetAllCompany(params) {
  const { page = 1, limit = 10, search, status, priority, sortField, sortDirection } = params || {};

  return useQuery({
    queryKey: ["GetAllCompany", page, limit, search, status, priority, sortField, sortDirection],
    queryFn: () => companyServices.getAllCompany({ page, limit, search, status, priority, sortField, sortDirection }),
    onSuccess: (res) => {
        return res.data;
    },
    keepPreviousData: true,
  })
}
