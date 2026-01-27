import { useQuery } from '@tanstack/react-query'
import limitServices from '../../services/limitService';
import { setLimitsInfo } from '../../store/slice/appSlice';
import { useDispatch } from 'react-redux';

export function useGetAllLimit() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey:["GetAllLimits"],
    queryFn:()=>limitServices.GetLimits(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
