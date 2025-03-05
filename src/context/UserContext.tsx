import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            console.log("Token found:", token);

            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await axios.get('https://clinic-backend-p4fx.onrender.com/api/auth/user');
                    console.log("User data received:", res.data);
                    setUser(res.data);
                    setIsLoggedIn(true);
                } catch (err) {
                    console.error('Error fetching user:', err);
                    logout();
                }
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }

            setLoading(false);
        };

        checkLoggedIn();
    }, []); // ✅ Removed isLoggedIn from dependencies to prevent infinite loop

    const login = async (token: string) => {
        console.log("Logging in with token:", token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const res = await axios.get('https://clinic-backend-p4fx.onrender.com/api/auth/user');
            console.log("Login successful, user data:", res.data);
            setUser(res.data);
            setIsLoggedIn(true);
        } catch (err) {
            console.error('Login failed:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log("Logging out...");
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, isLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
