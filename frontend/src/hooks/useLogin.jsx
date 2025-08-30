import { useMutation } from "@tanstack/react-query";
import authServices from "../services/authService";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/slice/appSlice";
import { useNavigate } from "react-router-dom";
import LoadingGif from "../component/loading";

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.login,
    onSuccess: (res) => {
      dispatch(setUserInfo(res.data.user));
      if(res.data.user.user_role == "distributer"){
        navigate("/distributer/dashboard");
      }else if(res.data.user.user_role == "seller"){
        navigate("/seller/dashboard");
      }else if(res.data.user.user_role == "salesman"){
        navigate("/salesman/dashboard");
      }
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        dispatch(setUserInfo(null));
        navigate("/login");
      }
    }
  });
}
