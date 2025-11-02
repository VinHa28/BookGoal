import api from "../config/api";
import * as SecureStore from "expo-secure-store";
import { getAuthHeader } from "../utils/utils";

export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, user } = res.data;

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    console.log(user);
    return { user, accessToken };
  } catch (error) {
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
        { headers: { Authorization: `Bearer ${token}` } }
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

export const signUp = async (fullName, email, phone, password) => {
  try {
    const res = await api.post("/auth/register", {
      username: fullName,
      email,
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

export const getStoredUser = async () => {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
};

export const localLogout = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("user");
};

export const getUserInfo = async (id) => {
  try {
    const headers = await getAuthHeader();
    const res = await api.get(`/users/${id}`, {}, { headers });
    await SecureStore.setItemAsync("user", JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Lấy thông tin người dùng thất bại";
    console.error("Có lỗi khi lấy thông tin người dùng:", message);
    throw { message };
  }
};

export const updateUser = async (id, username) => {
  try {
    const headers = await getAuthHeader();
    const res = await api.put(`/users/my/${id}`, { username }, { headers });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Cập nhật thất bại";
    console.error("Có lỗi khi cập nhật thông tin người dùng:", message);
    throw { message };
  }
};

// ======================= FORGOT PASSWORD =======================
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gửi OTP thất bại. Vui lòng thử lại.";
    console.error("Có lỗi khi gửi OTP:", message);
    throw { message };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Đặt lại mật khẩu thất bại.";
    console.error("Có lỗi khi đặt lại mật khẩu:", message);
    throw { message };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) throw new Error("Không tìm thấy token người dùng");

    const res = await api.post(
      "/auth/change-password",
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Đổi mật khẩu thất bại";
    console.error("Có lỗi khi đổi mật khẩu:", message);
    throw { message };
  }
};
