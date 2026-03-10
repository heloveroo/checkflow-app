import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.me()
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (...roles) => roles.includes(user?.role);
  const isAdmin = () => user?.role === 'admin';
  const isManager = () => ['admin', 'manager'].includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole, isAdmin, isManager, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
