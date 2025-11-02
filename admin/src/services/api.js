import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("accessToken");

// Config axios với token
const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTH ============
export const login = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

export const logout = () => {
  return apiClient.post("/auth/logout");
};

export const getStats = () => {
  return apiClient.get("/stats");
};

// ============ USERS ============
export const getAllUsers = () => {
  return apiClient.get("/users");
};

export const getUserById = (id) => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
  return apiClient.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`);
};

export const updateUserStatus = (id, data) => {
  return apiClient.patch(`/users/${id}/status`, data);
};

// ============ FIELDS ============
export const getFields = () => {
  return apiClient.get("/fields");
};

export const getFieldById = (id) => {
  return apiClient.get(`/fields/${id}`);
};

export const addField = (data) => {
  return apiClient.post("/fields", data);
};

export const updateField = (id, data) => {
  return apiClient.put(`/fields/${id}`, data);
};

export const deleteField = (id) => {
  return apiClient.delete(`/fields/${id}`);
};

// ============ BOOKINGS ============
export const getAllBookings = () => {
  return apiClient.get("/bookings");
};
export const getRecentBookings = () => {
  return apiClient.get("/bookings/recent");
};

export const confirmBooking = (id) => {
  return apiClient.put(`/bookings/${id}/confirm`);
};

export const cancelBooking = (id) => {
  return apiClient.put(`/bookings/cancel/${id}`);
};

export const updateBookingStatus = (id, status) => {
  return apiClient.patch(`bookings/${id}/status`, { status });
};

// ============ NOTIFICATIONS ============
export const createNotification = (data) => {
  return apiClient.post("/notifications", data);
};

export const getAllNotifications = () => {
  return apiClient.get("/notifications");
};

export default apiClient;
