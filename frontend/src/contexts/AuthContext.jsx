import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [username, setUsername] = useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const login = useCallback((user) => {
    const { token: responseToken, username: responseUsername } = user;
    localStorage.setItem('token', responseToken);
    localStorage.setItem('username', responseUsername);
    setToken(responseToken);
    setUsername(responseUsername);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
  }, []);

  const authContextValue = useMemo(
    () => ({
      token,
      username,
      login,
      logout,
    }),
    [token, username, login, logout]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
