import { useContext } from 'react';
import { AuthCtx } from './authContext.js';

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};
