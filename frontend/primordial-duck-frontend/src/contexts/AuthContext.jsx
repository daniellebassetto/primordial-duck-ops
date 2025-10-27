import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            token,
            name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            ...payload
          });
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    const token = authData.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({ ...authData, ...payload });
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const register = (authData) => {
    const token = authData.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({ ...authData, ...payload });
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};