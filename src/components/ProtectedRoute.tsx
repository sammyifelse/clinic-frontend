import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
    children: JSX.Element;
    role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, loading, isLoggedIn } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;

    if (!isLoggedIn || !user || user.role !== role) {
        console.warn(`Access denied: Required role=${role}, User role=${user?.role}`);
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
