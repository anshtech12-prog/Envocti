import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.success) {
          setUser(res.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to load user profile:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register User
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Login User
  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/update-profile', profileData);
      if (res.success) {
        setUser((prevUser) => ({
          ...prevUser,
          ...res.data,
        }));
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    role: user?.role || null,
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
