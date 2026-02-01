import { useQuery } from '@tanstack/react-query'
import subadminServices from '../../services/subadminService'

export function useGetAllSubAdmins() {

  return useQuery({
    queryKey: ["GetAllSubAdmins"],
    queryFn: () => subadminServices.getAllSubadmins(),
    onSuccess: (res) => {
        return res.data;
    }
  })
}
