import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEMO_MODE } from '../constants/index.js';
import { mockLogin } from '../mock/handlers.js';
import * as authApi  from '../api/auth.api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem('tcms_user');
    const token  = localStorage.getItem('tcms_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    let result;
    if (DEMO_MODE) {
      result = mockLogin(email, password);
    } else {
      result = await authApi.login(email, password);
    }
    const { token, user: u } = result;
    localStorage.setItem('tcms_token', token);
    localStorage.setItem('tcms_user',  JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    if (!DEMO_MODE) {
      try { await authApi.logout(); } catch {}
    }
    localStorage.removeItem('tcms_token');
    localStorage.removeItem('tcms_user');
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};