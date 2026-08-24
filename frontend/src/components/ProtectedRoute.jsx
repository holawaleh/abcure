import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { accessToken, isAdmin, loading } = useAuth();

  if (loading) return <p className="text-center py-12 text-gray-400">Loading...</p>;
  if (!accessToken || !isAdmin) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
