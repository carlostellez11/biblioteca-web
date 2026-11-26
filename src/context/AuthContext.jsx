
import { createContext, useContext, useState } from 'react';
import {
  login as loginService,
  logout as logoutService,
  getStoredUser,
} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  async function login(email, password) {
    const userData = await loginService(email, password);
    setUser(userData);
    return userData;
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
