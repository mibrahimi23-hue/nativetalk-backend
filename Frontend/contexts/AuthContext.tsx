import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setClientHooks } from '@/services/client';
import { saveToken, getToken, deleteToken } from '@/services/storage';
import * as api from '@/services/api';

const ACCESS_KEY = 'nt_access';
const REFRESH_KEY = 'nt_refresh';

export type Role = 'student' | 'teacher' | 'admin' | null;

export interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  role: Role | string;
  phone?: string;
  profile_photo?: string;
  is_suspended?: boolean;
  teacher_id?: string;
  student_id?: string;
  bio?: string;
  is_verified?: boolean;
  timezone?: string;
}

interface AuthState {
  user: CurrentUser | null;
  role: Role;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<CurrentUser>;
  updateMe: (p: Record<string, unknown>) => Promise<void>;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  phone?: string;
  timezone?: string;
  bio?: string;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const accessRef = useRef<string | null>(null);
  const refreshRef = useRef<string | null>(null);
  accessRef.current = accessToken;
  refreshRef.current = refreshToken;

  const applyTokens = useCallback(async (access: string, refresh: string, userData: CurrentUser) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    await saveToken(ACCESS_KEY, access);
    await saveToken(REFRESH_KEY, refresh);
  }, []);

  const clearTokens = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    await deleteToken(ACCESS_KEY);
    await deleteToken(REFRESH_KEY);
  }, []);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
    const rt = refreshRef.current;
    if (!rt) return false;
    try {
      const res = await api.auth.refresh(rt) as { access_token: string; refresh_token: string; user: CurrentUser };
      await applyTokens(res.access_token, res.refresh_token, res.user);
      return true;
    } catch {
      await clearTokens();
      return false;
    }
  }, [applyTokens, clearTokens]);

  useEffect(() => {
    setClientHooks({
      getAccessToken: () => accessRef.current,
      onUnauthorized: tryRefresh,
    });
  }, [tryRefresh]);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const [access, refresh] = await Promise.all([getToken(ACCESS_KEY), getToken(REFRESH_KEY)]);
        if (access && refresh) {
          setAccessToken(access);
          setRefreshToken(refresh);
          // Verify token is valid by fetching me
          try {
            const me = await api.users.me() as CurrentUser;
            setUser(me);
          } catch {
            // Token expired — try refresh
            const rt = refresh;
            try {
              const res = await api.auth.refresh(rt) as { access_token: string; refresh_token: string; user: CurrentUser };
              await applyTokens(res.access_token, res.refresh_token, res.user);
            } catch {
              await clearTokens();
            }
          }
        }
      } catch {
        // ignore storage errors
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.auth.login({ email, password }) as { access_token: string; refresh_token: string; user: CurrentUser };
    await applyTokens(res.access_token, res.refresh_token, res.user);
  }, [applyTokens]);

  const register = useCallback(async (p: RegisterPayload) => {
    const res = await api.auth.register(p) as { access_token: string; refresh_token: string; user: CurrentUser };
    await applyTokens(res.access_token, res.refresh_token, res.user);
  }, [applyTokens]);

  const logout = useCallback(async () => {
    try { await api.auth.logout(refreshRef.current ?? undefined); } catch {}
    await clearTokens();
  }, [clearTokens]);

  const refreshMe = useCallback(async () => {
    const me = await api.users.me() as CurrentUser;
    setUser(me);
    return me;
  }, []);

  const updateMe = useCallback(async (p: Record<string, unknown>) => {
    const updated = await api.users.updateMe(p) as CurrentUser;
    setUser(updated);
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    role: user?.role ?? null,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!accessToken && !!user,
    login,
    register,
    logout,
    refreshMe,
    updateMe,
  }), [user, accessToken, refreshToken, loading, login, register, logout, refreshMe, updateMe]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
