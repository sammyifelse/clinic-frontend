import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientRegistration from './pages/PatientRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Attendance from './pages/attendance'; // Import Attendance Page

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/doctor-dashboard" 
                element={
                  <ProtectedRoute role="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient-registration" 
                element={
                  <ProtectedRoute role="patient">
                    <PatientRegistration />
                  </ProtectedRoute>
                } 
              />
              {/* New Route for Attendance */}
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute role="doctor">
                    <Attendance />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
