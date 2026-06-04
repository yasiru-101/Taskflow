/**
 * @file ProtectedRoute.jsx
 * @description Route route-guard wrapping private app screens.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wrap routes that require authentication and optionally a specific role.
 * @param {string[]} roles - allowed roles (empty = any authenticated user)
 */
/**
 * Route checker checking authentication status, redirecting unauthorized users, and policing user roles.
 *
 * @param {React.ReactNode} props.children - Target private screen route element
 * @param {string[]} props.roles - Preselected user roles allowed to access this component
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, loading, role, mustResetPassword } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force password reset if mustResetPassword flag is set
  if (mustResetPassword && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }

  // Role-based access check
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
