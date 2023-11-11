import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const currentUserLocal = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUserLocal);

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [login, logout, user],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
