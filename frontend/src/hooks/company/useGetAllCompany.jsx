import { useQuery } from '@tanstack/react-query'
import companyServices from '../../services/companyServices'

export function useGetAllCompany() {
  return useQuery({
    queryKey:["GetAllCompany"],
    queryFn:()=>companyServices.getAllCompany(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
