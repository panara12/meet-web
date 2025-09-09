import { useQuery } from '@tanstack/react-query'
import packagingServices from '../../services/packagingService'

export function useGetSeller() {
  return useQuery({
    queryKey:["SellerOfPackaging"],
    queryFn:()=>packagingServices.getSellerList(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
