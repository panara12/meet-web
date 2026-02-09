import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetLoggedUser } from "../hooks/auth/getLoggedUser";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const {data:userloggged} = useGetLoggedUser()
  console.log("User logged data in RoleProtectedRoute:", userloggged);
  const userInfo = useSelector((state) => state.app.userInfo);

  if (!userloggged?.user && !userInfo) {
    // console.log("No user info found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userloggged?.user?.user_role || userInfo?.user_role)) {
    let role = userloggged.user.user_role;
    if (role === "admin") {
      role = "distributer";
    }
    // console.log("Redirecting to dashboard for role:", role);
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
