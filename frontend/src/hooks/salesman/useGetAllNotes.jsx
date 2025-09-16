import { useQuery } from '@tanstack/react-query'
import salesmanService from '../../services/salesmanService'

export function useGetAllNotes() {
  return useQuery({
    queryKey:["SalesmanNotes"],
    queryFn:()=>salesmanService.getAllNotes(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
