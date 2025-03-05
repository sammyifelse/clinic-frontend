import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, loading, isLoggedIn } = useContext(UserContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    console.log("User:", user);
    console.log("User Role:", user?.role);
    console.log("Required Role:", role);
    console.log("isLoggedIn:", isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/not-authorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
