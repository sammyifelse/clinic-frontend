import React, { useState, useEffect } from "react";
import axios from "axios";

interface AttendanceRecord {
  id: number;
  fullName: string;
  firstVisit: string;
  caseOf: string;
  remedy: string;
  paymentMethod: string;
}

const Attendance: React.FC = () => {
  const [patients, setPatients] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://clinic-backend-p4fx.onrender.com/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch attendance records. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Daily Attendance</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading attendance...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : patients.length === 0 ? (
        <p className="text-center text-gray-500">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">First Visit</th>
                <th className="border p-2">Case Of</th>
                <th className="border p-2">Remedy</th>
                <th className="border p-2">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border hover:bg-gray-100">
                  <td className="border p-2 text-center">{patient.id}</td>
                  <td className="border p-2">{patient.fullName}</td>
                  <td className="border p-2">{new Date(patient.firstVisit).toLocaleDateString()}</td>
                  <td className="border p-2">{patient.caseOf}</td>
                  <td className="border p-2">{patient.remedy}</td>
                  <td className="border p-2 text-center">{patient.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
