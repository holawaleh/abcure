@'
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      setLoading(false);
      return;
    }
    api.post("/token/refresh/", { refresh: refreshToken })
      .then((res) => {
        setAccessToken(res.data.access);
        api.defaults.headers.common.Authorization = `Bearer ${res.data.access}`;
        return checkIsAdmin(res.data.access);
      })
      .catch(() => {
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function checkIsAdmin(token) {
    try {
      const res = await api.get("/admin/categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    }
  }

  async function login(username, password) {
    const res = await api.post("/token/", { username, password });
    const { access, refresh } = res.data;
    localStorage.setItem("refresh_token", refresh);
    setAccessToken(access);
    api.defaults.headers.common.Authorization = `Bearer ${access}`;
    await checkIsAdmin(access);
    return true;
  }

  function logout() {
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setIsAdmin(false);
    delete api.defaults.headers.common.Authorization;
  }

  return (
    <AuthContext.Provider value={{ accessToken, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
'@ | Set-Content src\context\AuthContext.jsx