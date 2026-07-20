import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function RequireAuth({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
