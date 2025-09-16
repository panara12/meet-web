import { useQuery } from '@tanstack/react-query'
import salesmanServices from '../../services/salesmanService'

export function useGetSalesmanById(id) {
  return useQuery({
    queryKey:["salesmanId",id],
    queryFn:()=>salesmanServices.getSalesmanById(id),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
