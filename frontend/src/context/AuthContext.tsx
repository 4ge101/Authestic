import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiUser } from '../services/api';

interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isSupport: boolean;
  login: (email: string, password: string) => Promise<ApiUser | undefined>;
  register: (payload: { email: string; password: string; name: string; avatar?: string }) => Promise<{ devVerificationToken?: string }>;
  logout: () => Promise<void>;
  updatePreferences: (prefs: Partial<ApiUser['preferences']>) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      setUser(res.user);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const res = await api.auth.login({ email, password });
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: { email: string; password: string; name: string; avatar?: string }) => {
    setError(null);
    const res = await api.auth.register(payload);
    setUser(res.user);
    return { devVerificationToken: res.devVerificationToken };
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
    }
  };

  const updatePreferences = async (prefs: Partial<ApiUser['preferences']>) => {
    if (!user) return;
    const res = await api.users.updateProfile(prefs);
    setUser(res.user);
  };

  const updateName = async (name: string) => {
    if (!user) return;
    const res = await api.users.updateProfile({ name });
    setUser(res.user);
  };

  const isAdmin = user?.role === 'admin';
  const isSupport = user?.role === 'support' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAdmin,
        isSupport,
        login,
        register,
        logout,
        updatePreferences,
        updateName,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
