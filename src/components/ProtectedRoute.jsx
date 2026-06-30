import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute.jsx
 * ------------------------------------------------------------------
 * Membungkus halaman yang membutuhkan sesi login. Jika user belum
 * login (belum ada data di AuthContext), redirect ke halaman Login.
 * ------------------------------------------------------------------
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
