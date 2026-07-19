import { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if a user is already logged in when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('railway_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to handle login
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('railway_user', JSON.stringify(userData));
    localStorage.setItem('railway_token', token);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('railway_user');
    localStorage.removeItem('railway_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};