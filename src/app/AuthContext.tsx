// [path]: app/AuthContext.tsx

'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { verifySoftLogin } from '@/lib/soft-auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'ABSOLUTE_OFFROAD_USER_V2';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Changed from userRole
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string, password: string): boolean => {
    const userToLogin = mockUsers.find((u) => u.id === userId);
    if (!userToLogin || !verifySoftLogin(userId, password)) {
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userToLogin));
      setUser(userToLogin);
      return true;
    } catch (error) {
      console.error('Could not set user in localStorage:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Could not remove user from localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};