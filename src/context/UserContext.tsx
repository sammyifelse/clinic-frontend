import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Prevents state updates after unmount

    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(
          "https://clinic-backend-p4fx.onrender.com/api/auth/user"
        );

        if (isMounted) {
          setUser(res.data);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkLoggedIn();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setLoading(true);

    try {
      const res = await axios.get(
        "https://clinic-backend-p4fx.onrender.com/api/auth/user"
      );
      setUser(res.data);
      setIsLoggedIn(true);

      console.log("User logged in:", res.data);
      // Redirect based on role
      if (res.data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (res.data.role === "patient") {
        navigate("/register"); // Assuming this leads to PatientRegistration.tsx
      } else if (res.data.role === "receptionist") {
        navigate("/"); // Redirecting to home or another appropriate page
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      console.error("Login error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, loading, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
