import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"; // ← Add this import
import { useGetLoggedUser } from "../hooks/auth/getLoggedUser";
import { setUserInfo } from "../store/slice/appSlice";
import LoadingGif from "../component/loading";

export default function ProtectedRoute() {
    
  const { data: loggedUser, isLoading, isError } = useGetLoggedUser();
  // console.log(loggedUser);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (loggedUser) {
      dispatch(setUserInfo(loggedUser));
    }
  }, [loggedUser, dispatch]);

  if (isLoading) {
    return <LoadingGif size={200} />
  }

  if (!loggedUser) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // logged in → render child routes
  return <Outlet />;
}