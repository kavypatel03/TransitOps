import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, restore user from localStorage or sessionStorage
  useEffect(() => {
    const stored =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        const roleMapping = {
            'Fleet Manager': 'fleet_manager',
            'Driver': 'driver',
            'Safety Officer': 'safety_officer',
            'Financial Analyst': 'financial_analyst'
        };
        const mappedRole = roleMapping[userData.role] || userData.role;
        setUser({ ...userData, role: mappedRole });
      } catch {
        // corrupted storage — clear it
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData) => {
    // Map backend role to frontend expected strings
    const roleMapping = {
        'Fleet Manager': 'fleet_manager',
        'Driver': 'driver',
        'Safety Officer': 'safety_officer',
        'Financial Analyst': 'financial_analyst'
    };
    const mappedRole = roleMapping[userData.role] || userData.role;
    setUser({ ...userData, role: mappedRole });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
