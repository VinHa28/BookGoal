import { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  login as loginService,
  logout as logoutService,
} from "../services/authServices";
import { useRouter } from "expo-router";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      if (storedUser) setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);
  const login = async (phone, password) => {
    try {
      const { user: loggedInUser } = await loginService(phone, password);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    await logoutService();
    setUser(null);
    router.replace("/(auth)");
  };
  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};
