import { Navigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { state } = useApp();
  const location = useLocation();

  if (!state.currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(state.currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
