import { useQuery } from '@tanstack/react-query'
import limitServices from '../../services/limitService';

export function useGetAllLimit() {
  return useQuery({
    queryKey:["GetAllLimits"],
    queryFn:()=>limitServices.GetLimits(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
