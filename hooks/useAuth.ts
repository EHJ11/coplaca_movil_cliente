import { useState, useCallback } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  balance?: number;
}

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export function useAuth(initialUser?: User | null): UseAuthReturn {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = user !== null;

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updates } : null));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    setUser,
    setLoading,
    updateUser,
    logout,
  };
}
