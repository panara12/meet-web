import { useQuery } from '@tanstack/react-query'
import userServices from '../../services/userService'

export function useGetUserById(id) {
  return useQuery({
    queryKey:["userId",id],
    queryFn:()=>userServices.getUserById({id}),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
