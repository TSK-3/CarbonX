import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "carbonx-auth";

function loadStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { user: null, token: "" };
  } catch {
    return { user: null, token: "" };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  function persist(nextAuth) {
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  }

  async function register(values) {
    const result = await api.register(values);
    persist(result);
  }

  async function login(values) {
    const result = await api.login(values);
    persist(result);
  }

  function logout() {
    setAuth({ user: null, token: "" });
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ ...auth, register, login, logout }),
    [auth.user, auth.token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
