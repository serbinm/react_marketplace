import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // on first render check for token in storage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // login function
  const login = () => {
    setIsLoggedIn(true);
  };

  // logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
