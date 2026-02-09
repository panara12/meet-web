import { useQuery } from '@tanstack/react-query'
import orderServices from '../../services/orderService'

export function useGetAllOrders() {
  return useQuery({
    queryKey:["getAllOrders"],
    queryFn:()=>orderServices.getAllOrders(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
