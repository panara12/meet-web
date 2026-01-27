import { useQuery } from '@tanstack/react-query'
import cartServices from '../../services/cartService';

export function useGetAllCart() {
  return useQuery({
    queryKey:["GetAllCarts"],
    queryFn: ()=> cartServices.getCart(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
