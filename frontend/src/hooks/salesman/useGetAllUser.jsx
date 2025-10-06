import { useQuery } from '@tanstack/react-query'
import companyServices from '../../services/companyServices'

export function useGetAllUser() {
  return useQuery({
    queryKey:["GetAllUser"],
    queryFn:()=>companyServices.getAllUser(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
