import { useQuery } from '@tanstack/react-query'
import authServices from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setUserInfo,setLimitsInfo } from '../../store/slice/appSlice';

export function useGetLoggedUser() {
  const dispatch = useDispatch();
  // console.log("use get logged user called");
  return useQuery({
    queryKey:["currentUser"],
    queryFn:()=>authServices.getLoggedUser(),
    onSuccess:()=>{
      
    },
    onError:()=>{
      dispatch(setUserInfo(null));
    }
  })
}
