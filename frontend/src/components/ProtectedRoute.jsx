
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Fallback: also check storage directly (handles page refresh race condition)
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const currentUser = user || storedUser;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedRole = (currentUser.role || '').toLowerCase();

    const allowed = allowedRoles.some(
      (r) => r.toLowerCase() === normalizedRole
    );

    if (!allowed) {
      if (normalizedRole === 'fleet_manager') return <Navigate to="/fleet" replace />;
      if (normalizedRole === 'driver') return <Navigate to="/trips" replace />;
      if (normalizedRole === 'financial_analyst' || normalizedRole === 'financial analyst') return <Navigate to="/expenses" replace />;
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
