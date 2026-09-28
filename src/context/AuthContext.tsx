import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(authService.getAuthToken());
  const { showToast } = useToast();

  useEffect(() => {
    const user = authService.getCurrentUser();
    const currentToken = authService.getAuthToken();
    if (user && currentToken) {
      setCurrentUser(user);
      setToken(currentToken);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await authService.login(email, pass);
      setCurrentUser(res.user);
      setToken(res.token);
      showToast(`Welcome back, ${res.user.name}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      const res = await authService.register(name, email, pass, phone);
      setCurrentUser(res.user);
      setToken(res.token);
      showToast(`Welcome to Aurelia Botanica, ${res.user.name}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = async (name: string, phone: string) => {
    if (!currentUser) return;
    try {
      const updated = await authService.updateProfile(currentUser.id, name, phone);
      setCurrentUser(updated);
      showToast('Profile details updated.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const resetToken = await authService.forgotPassword(email);
      showToast('Reset instructions generated.', 'info');
      return resetToken;
    } catch (err: any) {
      showToast(err.message || 'Error processing request', 'error');
      throw err;
    }
  };

  const resetPassword = async (token: string, newPass: string) => {
    try {
      await authService.resetPassword(token, newPass);
      showToast('Password reset successfully. You can now log in.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset password', 'error');
      throw err;
    }
  };

  const isAdmin = !!currentUser?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
      }}
    >
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
