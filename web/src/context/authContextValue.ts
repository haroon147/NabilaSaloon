import { createContext } from 'react';
import type { User, UserRole } from '../types';

export interface AuthCtx {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (params: { name: string; email: string; phone: string; password: string; role: UserRole }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthCtx>(null!);
