import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as api from '../services/mockApi';
import * as realApi from '../services/api';
import { AuthContext, type AuthCtx } from './authContextValue';

// Set to true after running `npm run seed` and starting the backend
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
const client = USE_BACKEND ? realApi : api;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(!USE_BACKEND);
  const [error, setError]     = useState<string | null>(null);

  // Restore session from JWT token on page reload (real backend only)
  useEffect(() => {
    if (!USE_BACKEND) return;
    const token = localStorage.getItem('token');
    if (!token) { setAuthChecked(true); return; }
    setLoading(true);
    realApi.getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => { setLoading(false); setAuthChecked(true); });
  }, []);

  const login: AuthCtx['login'] = async (email, password, role) => {
    setLoading(true); setError(null);
    try {
      const u = await client.login(email, password, role);
      setUser(u);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally { setLoading(false); }
  };

  const register: AuthCtx['register'] = async (params) => {
    setLoading(true); setError(null);
    try {
      const u = await client.register(params);
      setUser(u);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally { setLoading(false); }
  };

  const logout = () => {
    if (USE_BACKEND) realApi.logout();
    setUser(null); setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authChecked, error, login, register, logout, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  );
}
