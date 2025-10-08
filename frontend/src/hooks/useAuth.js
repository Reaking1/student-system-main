import { useState, useCallback } from "react";
import * as authService from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(() => authService.getStoredAuth()?.user || null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      if (data.status === "success") {
        setUser(data.user);
      }
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, login, logout, loading };
}
