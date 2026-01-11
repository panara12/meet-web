import { useQuery } from '@tanstack/react-query'
import paymentServices from '../../services/paymentService';

export function useGetAllPayment() {
  return useQuery({
    queryKey:["GetAllPayments"],
    queryFn:async ()=> await paymentServices.GetAllPayments(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
