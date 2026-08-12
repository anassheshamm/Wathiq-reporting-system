import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/heads" replace />;

      case "doctor":
        return <Navigate to="/doctor" replace />;

      case "teamLeader":
        return <Navigate to="/team-leader" replace />;

      default:
        break;
    }
  }

  return children;
};

export default PublicRoute;