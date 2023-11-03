import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const login = useCallback((user, authToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', authToken);
    setCurrentUser(user);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToken('');
  }, []);

  const authContextValue = useMemo(
    () => ({
      currentUser,
      token,
      login,
      logout,
    }),
    [currentUser, token, login, logout],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
