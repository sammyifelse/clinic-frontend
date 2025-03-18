import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Stethoscope } from "lucide-react";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://clinic-backend-p4fx.onrender.com/api/auth/login",
        formData
      );
      console.log("Login Response:", res.data);
      const userRole = res.data.user.role;

      await login(res.data.token);

      console.log("Login successful. Redirecting based on role:", userRole);
      if (userRole === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-registration");
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]">
      <div className="relative bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg p-8 max-w-md w-full">
        {/* Soft Floating Decorations */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white/40 rounded-full shadow-md"></div>
        <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-teal-300/40 rounded-full shadow-lg"></div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 text-[#3A3A3A]">
            <Stethoscope size={32} className="text-teal-500" />
            <h2 className="text-2xl font-bold">Shifa Clinic</h2>
          </div>
          <p className="text-[#3A3A3A]/70 text-sm">Your health, our priority</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#3A3A3A] text-sm font-semibold mb-1">Email</label>
            <input
              className="w-full px-4 py-2 bg-white/40 text-[#3A3A3A] placeholder-[#3A3A3A]/50 border border-white/50 rounded-lg focus:ring-2 focus:ring-teal-300 focus:outline-none transition"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#3A3A3A] text-sm font-semibold mb-1">Password</label>
            <input
              className="w-full px-4 py-2 bg-white/40 text-[#3A3A3A] placeholder-[#3A3A3A]/50 border border-white/50 rounded-lg focus:ring-2 focus:ring-teal-300 focus:outline-none transition"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-[#3A3A3A]/70 text-sm text-center">
          © 2025 Created by Samarjit
        </p>
      </div>
    </div>
  );
};

export default Login;
