import { useQuery } from '@tanstack/react-query'
import paymentServices from '../../services/paymentService';

export function useGetAllPayment(params) {
  const { page = 1, limit = 10, search, status,salesman, priority, sortField, sortDirection } = params || {};
  
  return useQuery({
    queryKey:["GetAllPayments", page, limit, search, status,salesman, priority, sortField, sortDirection],
    queryFn:async ()=> await paymentServices.GetAllPayments({
      page,
      limit,
      search,
      status,
      priority,
      salesman,
      sortField,
      sortDirection
    }),
    onSuccess:(res)=>{
        return res.data;
    },
    keepPreviousData: true,
  })
}
