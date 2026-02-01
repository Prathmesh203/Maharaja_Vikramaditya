import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext(null);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial auth check
  const navigate = useNavigate();
  const [sessionTimer, setSessionTimer] = useState(null);

  // Reset session timer on user activity
  const resetSessionTimer = useCallback(() => {
    if (sessionTimer) clearTimeout(sessionTimer);
    if (user) {
      const timer = setTimeout(() => {
        console.log('Session timed out');
        logout();
      }, SESSION_TIMEOUT);
      setSessionTimer(timer);
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('mousemove', resetSessionTimer);
    window.addEventListener('keypress', resetSessionTimer);
    return () => {
      window.removeEventListener('mousemove', resetSessionTimer);
      window.removeEventListener('keypress', resetSessionTimer);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [resetSessionTimer]);

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getProfile();
          setUser(res.data);
        } catch (error) {
          console.error("Session expired or invalid token");
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const userData = res.data;
      
      localStorage.setItem('token', userData.token);
      setUser(userData);
      
      // Redirect based on role
      if (userData.role === 'admin') navigate('/admin/dashboard');
      else if (userData.role === 'company') navigate('/company/dashboard');
      else navigate('/student/home');

      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      const userData = res.data;
      
      localStorage.setItem('token', userData.token);
      setUser(userData);

      if (userData.role === 'student') {
           navigate('/student/profile');
      } else {
           // Company often pending
           if (userData.status === 'pending') {
               navigate('/login', { state: { message: 'Registration successful! Please wait for admin approval.' } });
               logout(); // Force logout so they can't access yet
           } else {
               navigate('/company/dashboard');
           }
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (sessionTimer) clearTimeout(sessionTimer);
    navigate('/login');
  };

  const updateUser = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  if (loading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
