import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../services/sessionStorage";

function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken();
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
