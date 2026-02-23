import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;
    authService
      .getProfile()
      .then((profile) => {
        if (isMounted) {
          setUser(profile?.user || profile);
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (payload) => {
    const data = await authService.login(payload);
    const accessToken = data?.token;
    const loggedInUser = data?.user;

    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(loggedInUser || null);
    toast.success('Login successful');
  };

  const register = async (payload) => {
    await authService.register(payload);
    toast.success('Registration successful. Please login.');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.info('Logged out');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAuthLoading,
      login,
      register,
      logout,
      getErrorMessage
    }),
    [user, token, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
}
