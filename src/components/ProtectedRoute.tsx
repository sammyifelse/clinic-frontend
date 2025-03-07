import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading, isLoggedIn } = useContext(UserContext);
  const location = useLocation();

  console.log("ProtectedRoute Check:", {
    isLoggedIn,
    user,
    userRole: user?.role,
    requiredRole: role,
    location: location.pathname // Log the current location
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Allow access to /patient-registration even if not logged in
  if (location.pathname === '/patient-registration') {
    return <>{children}</>;
  }

  if (!isLoggedIn || !user) {
    console.log("Not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    console.log(`User role (${user.role}) doesn't match required role (${role})`);
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;