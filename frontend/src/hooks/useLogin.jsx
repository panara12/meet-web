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
      navigate("/dashboard");
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        dispatch(setUserInfo(null));
        navigate("/login");
      }
    }
  });
}
