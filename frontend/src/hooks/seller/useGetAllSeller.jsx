import { useQuery } from '@tanstack/react-query'
import sellerServices from '../../services/sellerService'

export function useGetAllSeller() {
  return useQuery({
    queryKey:["SellerOfPackaging"],
    queryFn:()=>sellerServices.getSellerList(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
