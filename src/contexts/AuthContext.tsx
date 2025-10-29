"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          apiClient.setToken(token);
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data.user);
            setToken(token);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiClient.clearToken();
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role = 'applicant') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.register({ name, email, password, role });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.clearToken();
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
