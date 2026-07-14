import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { decodeJwt, isExpired, getRole, getEmail } from "./jwt";

const STORAGE_KEY = "deliveryOrders.token";

interface AuthState {
  token: string | null;
  role: string | null;
  email: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function readStoredToken(): string | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  if (isExpired(decodeJwt(stored))) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);

  const login = (newToken: string) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  };

  const claims = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const value: AuthState = {
    token,
    role: getRole(claims),
    email: getEmail(claims),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
