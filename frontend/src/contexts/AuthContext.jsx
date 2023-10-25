import React, { createContext, useState, useMemo } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = ({ data }) => {
    localStorage.setItem('username', JSON.stringify(data));
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('username');
    setLoggedIn(false);
  };
  const getUserName = () => {
    const userId = JSON.parse(localStorage.getItem('username'));
    return userId?.username;
  };
  const authContextValue = useMemo(
    () => ({
      loggedIn,
      logout,
      login,
      getUserName,
    }),
    [loggedIn],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
