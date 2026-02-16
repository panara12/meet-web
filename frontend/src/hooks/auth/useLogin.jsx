import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authService";
import { setUserInfo } from "../../store/slice/appSlice";

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  return useMutation({
    mutationFn: authServices.login,
    onSuccess: (res) => {
      dispatch(setUserInfo(res.data.user));
      // console.log("login success", res);
      navigate('/loading', {
        state: {
          userRole: res.data.user.user_role,
          userData: res.data.user // ✅ Pass complete user data
        },
        replace: true // ✅ Replace history to prevent back navigation
      });
    },
    onError: (err) => {
      // console.log("error in login hook", err);
      if (err.response?.status === 401) {
        dispatch(setUserInfo(null));
        navigate("/login");
      }
    }
  });
}