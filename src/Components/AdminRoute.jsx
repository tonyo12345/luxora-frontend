import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

// Restricts access to admin users only
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}
