import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route Guard Component
 * Redirects to /login if user is not authenticated.
 * Redirects to unauthorized page or dashboard if user role is not allowed.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user.role !== 'admin' && !allowedRoles.includes(user.role)) {
    // Redirect to home if user role is not allowed (admin always passes)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
