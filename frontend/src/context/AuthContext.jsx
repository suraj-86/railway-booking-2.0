import { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// Reads the `exp` claim out of a JWT's payload (no signature check needed here —
// we're just asking "has this expired", not "is this authentic"; the backend
// still verifies the signature on every real request).
const isTokenExpired = (jwt) => {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    if (!payload.exp) return false; // no expiry claim -> treat as non-expiring
    return Date.now() >= payload.exp * 1000;
  } catch (err) {
    // Malformed token -> treat as expired so we log out rather than trust it
    return true;
  }
};

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('railway_user');
    localStorage.removeItem('railway_token');
  };

  // Check if a user is already logged in when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('railway_user');
    const storedToken = localStorage.getItem('railway_token');

    if (storedToken && isTokenExpired(storedToken)) {
      // Session expired while we were away — clear it immediately instead of
      // showing a "logged in" navbar for a session that's actually dead.
      logout();
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Also re-check every minute while the app is open, in case the token
  // expires mid-session (e.g. left the tab open overnight).
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('railway_token');
      if (storedToken && isTokenExpired(storedToken)) {
        logout();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to handle login
  const login = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('railway_user', JSON.stringify(userData));
    localStorage.setItem('railway_token', newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
