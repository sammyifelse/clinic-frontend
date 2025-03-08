import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Users, UserPlus, RefreshCw } from "lucide-react";

interface Patient {
  _id: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  chiefComplaint: string;
  createdAt: string;
}

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get the token from local storage
      const res = await axios.get(
        "https://clinic-backend-p4fx.onrender.com/api/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );
      setPatients(res.data);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch patients. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 text-white py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2" size={20} />
            <h2 className="text-lg font-bold">Patient List</h2>
          </div>
          <button
            onClick={fetchPatients}
            className="text-white hover:text-teal-200"
            title="Refresh patient list"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-4">Loading patients...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchTerm
                ? "No patients match your search"
                : "No patients registered yet"}
            </div>
          ) : (
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <li
                    key={patient._id}
                    className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                      selectedPatient?._id === patient._id
                        ? "bg-teal-50 border-l-4 border-teal-500"
                        : ""
                    }`}
                    onClick={() => handlePatientClick(patient)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          <span className="font-bold text-teal-600">
                            {index + 1}.{" "}
                          </span>{" "}
                          {/* Serial Number */}
                          {patient.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {patient.age} years, {patient.gender}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatDate(patient.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
        {selectedPatient ? (
          <div>
            <div className="bg-teal-600 text-white py-3 px-4">
              <h2 className="text-lg font-bold">Patient Details</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-teal-700 border-b pb-2">
                    Personal Information
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedPatient.fullName}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Age & Gender</p>
                    <p className="font-medium">
                      {selectedPatient.age} years, {selectedPatient.gender}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">
                      {formatDate(selectedPatient.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-teal-700 border-b pb-2">
                    Medical Information
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Chief Complaint</p>
                    <p className="font-medium">
                      {selectedPatient.chiefComplaint || "None specified"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Medical History</p>
                    <p className="font-medium">
                      {selectedPatient.medicalHistory || "None specified"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Current Medications</p>
                    <p className="font-medium">
                      {selectedPatient.currentMedications || "None specified"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Allergies</p>
                    <p className="font-medium">
                      {selectedPatient.allergies || "None specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
            <UserPlus size={48} className="text-teal-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Patient Selected
            </h3>
            <p className="text-gray-500 max-w-md">
              Select a patient from the list to view their detailed information
              and medical history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
