import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

function ProtectedRoute({ component: Component }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
      return <Navigate to="/login" />;
  }
  return <Component />;
}
export default ProtectedRoute;
