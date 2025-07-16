import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * @param {ReactNode} children - JSX children to render if authorized
 * @param {string[]} allowedRoles - roles that are allowed to access the route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
