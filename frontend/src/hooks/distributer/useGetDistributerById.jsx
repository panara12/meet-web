import { useQuery } from '@tanstack/react-query'
import distributerServices from '../../services/distributerService'

export function useGetDistributerById() {

  return useQuery({
    queryKey: ["GetDistributerById"],
    queryFn: () => distributerServices.getDistributer(),
    onSuccess: (res) => {
        return res.data;
    }
  })
}
