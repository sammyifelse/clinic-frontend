import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading, isLoggedIn } = useContext(UserContext);
  
  console.log("ProtectedRoute Check:", { 
    isLoggedIn,
    user,
    userRole: user?.role,
    requiredRole: role
  });
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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