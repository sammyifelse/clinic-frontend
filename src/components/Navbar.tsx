// CLINIC/src/components/Navbar.tsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-teal-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>
          <span className="text-xl font-bold">Shifa Clinic</span>
        </Link>

        {user ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.name}</span>
            
            {user.role === 'doctor' && (
              <>
                <Link to="/dashboard" className="mr-4 hover:underline">
                  Dashboard
                </Link>
                <Link to="/attendance" className="mr-4 hover:underline">
                  Attendance Sheet
                </Link>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="bg-white text-teal-600 px-4 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register" className="bg-white text-teal-600 px-4 py-1 rounded">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;