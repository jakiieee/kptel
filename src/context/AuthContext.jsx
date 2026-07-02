import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AUTH_STORAGE_KEY = "authUser";
const TOKEN_STORAGE_KEY = "authToken";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((authResult) => {
    // authResult: { token, user: { name, email } } -> hasil dari authService.login/register
    if (authResult?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, authResult.token);
    }
    if (authResult?.user) {
      setUser(authResult.user);
    }
  }, []);

  const updateProfile = useCallback((partialUser) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : partialUser));
  }, []);

  const logout = useCallback(() => {
    // TODO: BACKEND - panggil endpoint logout sebelum membersihkan sesi lokal, contoh:
    // await authService.logout();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
