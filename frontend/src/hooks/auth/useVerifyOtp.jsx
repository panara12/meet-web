import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authService";

function UseVerifyOtp() {
  const navigate = useNavigate();
  return useMutation({

    mutationFn: authServices.verifyOtp,
    onSuccess: (res) => {
      // ✅ If you're using axios, the useful data is usually in res.data
      const safeData = res?.data || {};
      console.log(res)
      // Navigate WITHOUT attaching full response object
      if(!res.data.success){
        return navigate('/login',{state : {result: res.data.message}})
      }
      navigate('/resetpassword', { state: { email: safeData.email } });
    }, 
    onError: (err) => {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  });
}

export default UseVerifyOtp