import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"; // ← Add this import
import { useGetLoggedUser } from "../hooks/auth/getLoggedUser";
import { setLimitsInfo, setUserInfo } from "../store/slice/appSlice";
import LoadingGif from "../component/loading";

export default function ProtectedRoute() {
    
  const { data: loggedUser, isLoading, isError, Error } = useGetLoggedUser();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.app.userInfo);
  if(userInfo){
    // console.log("user info from store",userInfo);
  } 
  useEffect(() => {
    if (loggedUser) {
      dispatch(setUserInfo(loggedUser.user));
      dispatch(setLimitsInfo(loggedUser.limits[0]))
    }
  }, [loggedUser, dispatch]);

  // ✅ Show loading while checking auth
  if (isLoading) {
    return <LoadingGif size={200} />
  }

  // ✅ Only redirect to login if we're SURE there's no user
  if (!userInfo && !loggedUser) {
    // console.log("no logged user found so go to login",isError,Error,loggedUser, isLoading);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}