import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Contexto de autenticación
 */
const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState(0);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  /**
   * Inicializa la sesión del usuario desde localStorage
   */
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const username = localStorage.getItem(STORAGE_KEYS.USERNAME);

      if (token && username && !authAPI.isTokenExpired()) {
        setUser(username);
        setIsAuthenticated(true);
        setTokenTimeRemaining(authAPI.getTokenTimeRemaining());
      } else if (token && !authAPI.isTokenExpired()) {
        // Token válido pero sin username
        setIsAuthenticated(true);
        setTokenTimeRemaining(authAPI.getTokenTimeRemaining());
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Actualiza el tiempo restante del token cada segundo
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateTokenTimer = () => {
      const remaining = authAPI.getTokenTimeRemaining();
      setTokenTimeRemaining(remaining);

      // Si el token expira, limpia la autenticación
      if (remaining <= 0) {
        handleLogout();
      }
    };

    // Actualiza cada segundo
    const interval = setInterval(updateTokenTimer, 1000);
    setRefreshInterval(interval);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /**
   * Maneja errores de autenticación desde el interceptor
   */
  useEffect(() => {
    const handleAuthError = () => {
      handleLogout();
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  /**
   * Realiza login del usuario
   */
  const handleLogin = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.login(username, password);
      setUser(username);
      setIsAuthenticated(true);
      setTokenTimeRemaining(authAPI.getTokenTimeRemaining());
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza logout del usuario
   */
  const handleLogout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setTokenTimeRemaining(0);
    setError(null);
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  }, [refreshInterval]);

  /**
   * Refresca el token manualmente
   */
  const refreshToken = useCallback(async () => {
    try {
      await authAPI.refreshToken();
      setTokenTimeRemaining(authAPI.getTokenTimeRemaining());
      return true;
    } catch (err) {
      handleLogout();
      return false;
    }
  }, [handleLogout]);

  const value = {
    user,
    isAuthenticated,
    loading,
    tokenTimeRemaining,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
