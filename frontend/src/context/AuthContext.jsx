import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (role) => {
    // Mock user profile based on role
    const profile = {
      name: role === 'fleet_manager' ? 'Admin User' : 'Test User',
      role: role,
      email: `${role}@transitops.io`
    };
    setUser(profile);
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
