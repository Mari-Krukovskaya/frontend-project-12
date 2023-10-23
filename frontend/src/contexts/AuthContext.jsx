import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = useCallback((user) => {
    const responseToken = user.token;
    const responseUsername = user.username;
    localStorage.setItem('token', responseToken);
    localStorage.setItem('username', responseUsername);
    setToken(responseToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
  }, []);

  const authContextValue = useMemo(() => ({
    token,
    setToken,
    login,
    logout,
  }), [token, setToken, login, logout]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
