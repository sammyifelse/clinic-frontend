import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ClipboardCheck } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const PatientRegistration: React.FC = () => {
  const { isLoggedIn } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    disease: '',
    symptoms: '',
    diagnosis: '',
    chiefComplaint: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to register a patient.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post('https://clinic-backend-p4fx.onrender.com/api/patients', formData, config);

      setSuccess('Patient registered successfully!');
      setFormData({
        fullName: '',
        age: '',
        gender: 'male',
        phone: '',
        address: '',
        medicalHistory: '',
        currentMedications: '',
        allergies: '',
        disease: '',
        symptoms: '',
        diagnosis: '',
        chiefComplaint: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-semibold">You must be logged in to register a patient.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-400 text-white py-5 px-6 flex items-center">
        <ClipboardCheck className="mr-3" size={28} />
        <h2 className="text-2xl font-bold">Patient Registration</h2>
      </div>

      <div className="p-6">
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Enter full name' },
              { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter age' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'Enter phone number' },
              { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter address' }
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700 font-semibold">{label}</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-700 font-semibold">Gender</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {[
              { label: 'Medical History', name: 'medicalHistory', placeholder: 'Previous conditions, surgeries, etc.' },
              { label: 'Current Medications', name: 'currentMedications', placeholder: 'List of current medications' },
              { label: 'Allergies', name: 'allergies', placeholder: 'List any allergies' },
              { label: 'Chief Complaint', name: 'chiefComplaint', placeholder: 'Describe the main reason for the visit' }
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="md:col-span-2">
                <label className="block text-gray-700 font-semibold">{label}</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  name={name}
                  placeholder={placeholder}
                  rows={3}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
