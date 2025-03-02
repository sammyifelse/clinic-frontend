import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return user.role === 'doctor' 
      ? <Navigate to="/doctor-dashboard" replace /> 
      : <Navigate to="/patient-registration" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;