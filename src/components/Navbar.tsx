import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Stethoscope } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Stethoscope size={24} />
          <span className="text-xl font-bold">Shifa Clinic</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:inline">Welcome, {user.name}</span>
              {user.role === 'doctor' && (
                <Link to="/doctor-dashboard" className="hover:text-teal-200">Dashboard</Link>
              )}
              {user.role === 'patient' && (
                <Link to="/patient-registration" className="hover:text-teal-200">Registration</Link>
              )}
              <button 
                onClick={handleLogout}
                className="bg-teal-700 hover:bg-teal-800 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-teal-200">Login</Link>
              <Link 
                to="/register" 
                className="bg-teal-700 hover:bg-teal-800 px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;