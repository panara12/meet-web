import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector(state => state.app.userInfo);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.user_role)) {
    return <Navigate to={`/${user.user_role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
