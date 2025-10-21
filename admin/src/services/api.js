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
export const login = (phone, password) => {
  return apiClient.post("/auth/login", { phone, password });
};

export const logout = () => {
  return apiClient.post("/auth/logout");
};

// ============ USERS ============
export const getAllUsers = () => {
  return apiClient.get("/users");
};

export const getTotalUsers = () => {
  return apiClient.get("/user")
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

// ============ BOOKINGS ============
export const getAllBookings = () => {
  return apiClient.get("/bookings");
};

export const confirmBooking = (id) => {
  return apiClient.put(`/bookings/${id}/confirm`);
};

export const cancelBooking = (id) => {
  return apiClient.put(`/bookings/cancel/${id}`);
};

// ============ NOTIFICATIONS ============
export const createNotification = (data) => {
  return apiClient.post("/notifications", data);
};

export const getAllNotifications = () => {
  return apiClient.get("/notifications");
};

export default apiClient;
