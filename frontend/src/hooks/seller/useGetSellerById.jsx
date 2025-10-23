import { useQuery } from '@tanstack/react-query'
import sellerServices from '../../services/clientService'

export function useGetSellerById(id) {
  return useQuery({
    queryKey:["sellerId",id],
    queryFn:()=>sellerServices.getSellerById(id),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
