import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('rca_user');
    const token = localStorage.getItem('rca_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // Refresh profile in background
      api.get('/auth/profile')
        .then((res) => {
          setUser((prev) => ({ ...prev, ...res.data }));
          localStorage.setItem('rca_user', JSON.stringify({ ...JSON.parse(savedUser), ...res.data }));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('rca_token', token);
    localStorage.setItem('rca_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('rca_token', token);
    localStorage.setItem('rca_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('rca_token');
    localStorage.removeItem('rca_user');
    setUser(null);
  };

  const updateSettings = async (settingsData) => {
    const res = await api.put('/auth/settings', settingsData);
    setUser((prev) => ({ ...prev, ...res.data }));
    localStorage.setItem('rca_user', JSON.stringify({ ...user, ...res.data }));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
