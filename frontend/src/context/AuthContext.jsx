import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pp_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, verify the stored token is still valid and refresh the
  // user profile from the server.
  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("pp_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("pp_token");
        localStorage.removeItem("pp_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("pp_token", res.data.token);
    localStorage.setItem("pp_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem("pp_token", res.data.token);
    localStorage.setItem("pp_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pp_token");
    localStorage.removeItem("pp_user");
    setUser(null);
  }, []);

  // Call after a successful profile update so the rest of the app
  // (sidebar avatar, My Space, etc.) reflects the change immediately
  // without needing a full page reload.
  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem("pp_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
