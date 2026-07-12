import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
