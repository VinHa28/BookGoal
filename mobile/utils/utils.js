import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    console.error(error);
    return true;
  }
};

export function formatDateToYYYYMMDD(dateObject) {
  if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
    return "";
  }

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) throw new Error("Missing access token");
  return { Authorization: `Bearer ${token}` };
};

export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "N/A";
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};