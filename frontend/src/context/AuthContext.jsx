import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('slt_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('slt_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('slt_user', JSON.stringify(res.data.user));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('slt_token', receivedToken);
    localStorage.setItem('slt_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('slt_token', receivedToken);
    localStorage.setItem('slt_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    setUser(res.data.user);
    localStorage.setItem('slt_user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('slt_token');
    localStorage.removeItem('slt_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isTourist: user?.role === 'tourist',
    isBusinessOwner: user?.role === 'business_owner',
    isAdmin: user?.role === 'admin',
    login,
    register,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};