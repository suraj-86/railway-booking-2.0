import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const isTokenExpired = (jwt) => {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    if (!payload.exp) return false; 
    return Date.now() >= payload.exp * 1000;
  } catch (err) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('railway_user');
    localStorage.removeItem('railway_token');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('railway_user');
    const storedToken = localStorage.getItem('railway_token');

    if (storedToken && isTokenExpired(storedToken)) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('railway_token');
      if (storedToken && isTokenExpired(storedToken)) {
        logout();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
