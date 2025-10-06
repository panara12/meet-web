import { useQuery } from '@tanstack/react-query'
import userServices from '../../services/userService'

export function useGetAllUser() {
  return useQuery({
    queryKey:["GetAllUser"],
    queryFn:()=>userServices.getAllUser(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
