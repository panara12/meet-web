import { useQuery } from '@tanstack/react-query'
import fileServices from '../../services/fileService'

export function useGetFilesById(id) {

  return useQuery({
    queryKey: ["GetAllFiles",id],
    queryFn: () => fileServices.getFilesById(id),
    onSuccess: (res) => {
        return res.data;
    }
  })
}
