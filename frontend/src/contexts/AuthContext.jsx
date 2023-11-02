import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext({});

const userName = JSON.parse(localStorage.getItem('username'));
const tokenLocalStorage = localStorage.getItem('token');

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(userName || null);
  const [token, setToken] = useState(tokenLocalStorage);

  const login = useCallback((name, authToken) => {
    localStorage.setItem('username', JSON.stringify(name));
    localStorage.setItem('token', authToken);
    setCurrentUser(name);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setCurrentUser('');
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
