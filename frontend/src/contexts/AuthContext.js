import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const localToken = JSON.parse(localStorage.getItem('username'));
  const [token, setToken] = useState(localToken ?? null);

  const logout = useCallback(() => {
    localStorage.removeItem('username');
    setToken('');
  }, []);

  const login = useCallback((resToken) => {
    localStorage.setItem('username', resToken);
    setToken(resToken);
  }, []);

  const getAuthHeader = useCallback(() => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [token]);

  const authContextValue = useMemo(
    () => ({
      token,
      login,
      logout,
      getAuthHeader,
    }),
    [token, login, logout, getAuthHeader],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
