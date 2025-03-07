import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientRegistration from './pages/PatientRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Home = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <h1 className="text-3xl font-bold text-teal-600">Welcome to Shifa Clinic</h1>
    <p className="mt-4 text-gray-700">Providing quality healthcare for all.</p>
    <div className="mt-6">
      <a href="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg mx-2">Register</a>
      <a href="/login" className="bg-gray-600 text-white px-4 py-2 rounded-lg mx-2">Doctor Login</a>
    </div>
  </div>
);

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/patient-registration" element={<PatientRegistration />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
