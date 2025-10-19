import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  getStoredUser,
  localLogout,
  login as loginService,
  logout as logoutService,
} from "../services/authServices";
import { useRouter } from "expo-router";
import { isTokenExpired } from "../utils/utils";
import { Alert } from "react-native";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      const token = await SecureStore.getItemAsync("accessToken");

      if (storedUser && token) {
        if (!isTokenExpired(token)) {
          setUser(storedUser);
        } else {
          await localLogout();
          setUser(null);
          Alert.alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          router.replace("/(auth)");
        }
      } else {
        setUser(null); // chưa login
        router.replace("/(auth)");
      }
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
