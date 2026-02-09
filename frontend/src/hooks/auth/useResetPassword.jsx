import { useMutation } from "@tanstack/react-query";
import authServices from "../../services/authService";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.resetPassword,
    onSuccess: (res) => {
      navigate('/login')
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  });
}
