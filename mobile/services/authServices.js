import api from "../config/api";
import * as SecureStore from "expo-secure-store";

export const login = async (phone, password) => {
  try {
    const res = await api.post("/auth/login", { phone, password });
    const { accessToken, user } = res.data;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    return { user, accessToken };
  } catch (error) {
    // Lấy message từ backend hoặc fallback
    const message =
      error.response?.data?.message || error.message || "Đăng nhập thất bại";

    console.error("Có lỗi khi đăng nhập:", message);

    throw { message };
  }
};

export const logout = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error(
      "Có lỗi khi đăng xuất: ",
      error.response?.data || error.message
    );
  }

  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("user");
};

export const getStoredUser = async () => {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
};

export const localLogout = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("user");
};

export const signUp = async (fullName, phone, password) => {
  try {
    const res = await api.post("/auth/register", {
      username: fullName,
      phone,
      password,
    });

    return res;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Đăng ký thất bại";

    console.error("Có lỗi khi đăng ký:", message);

    throw { message };
  }
};
