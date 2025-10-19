import api from "../config/api";
import * as SecureStore from "expo-secure-store";

export const getUserBookings = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      const res = await api.get(
        "/bookings/my",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error fetching bookings: ",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getLatestBooking = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      const res = await api.get(
        "/bookings/my-latest",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error fetching bookings: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createBooking = async (fieldId, date, timeSlot) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      const res = await api.post(
        "/bookings",
        { fieldId, date, timeSlot },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error creating booking: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
