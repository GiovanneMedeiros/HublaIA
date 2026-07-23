'use client';

import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    logout,
  };
}
