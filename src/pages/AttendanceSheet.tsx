import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

// Define interfaces for our data types
interface Patient {
  _id: string;
  name: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  patientName: string;
  patientId: number;
  caseDetails: string;
  remedy: string;
  paymentMethod: 'cash' | 'upi';
  doctorId: string;
}

const AttendanceSheet: React.FC = () => {
  const { user } = useContext(UserContext);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [caseDetails, setCaseDetails] = useState('');
  const [remedy, setRemedy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [patients, setPatients] = useState<Patient[]>([]);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await axios.get('/api/attendance');
        setAttendances(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance', err);
        setLoading(false);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await axios.get('/api/patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Error fetching patients', err);
      }
    };

    fetchAttendances();
    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const newAttendance = {
        date,
        patientName,
        patientId: parseInt(patientId),
        caseDetails,
        remedy,
        paymentMethod
      };
      
      await axios.post('/api/attendance', newAttendance);
      
      // Refresh attendance list
      const res = await axios.get('/api/attendance');
      setAttendances(res.data);
      
      // Clear form
      setPatientName('');
      setPatientId('');
      setCaseDetails('');
      setRemedy('');
      setPaymentMethod('cash');
      
    } catch (err) {
      console.error('Error submitting attendance', err);
    }
  };

  // Get today's attendance records
  const todayAttendances = attendances.filter(
    record => new Date(record.date).toISOString().split('T')[0] === date
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Attendance Sheet</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Add New Attendance</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-1">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Patient Name:</label>
              <select
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  const selectedPatient = patients.find(p => p.name === e.target.value);
                  if (selectedPatient) {
                    setPatientId(selectedPatient._id);
                  }
                }}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient.name}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">ID:</label>
              <input
                type="number"
                value={todayAttendances.length + 1}
                className="w-full border p-2 rounded bg-gray-100"
                readOnly
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Case Details:</label>
              <input
                type="text"
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="e.g. Homeopathic"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Remedy:</label>
              <input
                type="text"
                value={remedy}
                onChange={(e) => setRemedy(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Payment Method:</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="mr-2"
                  />
                  Cash
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mr-2"
                  />
                  UPI
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Record
          </button>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Today's Attendance ({todayAttendances.length})</h2>
        
        {todayAttendances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Patient Name</th>
                  <th className="border p-2">Case Details</th>
                  <th className="border p-2">Remedy</th>
                  <th className="border p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendances.map((record, index) => (
                  <tr key={record._id}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{record.patientName}</td>
                    <td className="border p-2">{record.caseDetails}</td>
                    <td className="border p-2">{record.remedy}</td>
                    <td className="border p-2 text-center">
                      {record.paymentMethod === 'cash' ? '💵' : '📱'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attendance records for today.</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceSheet;