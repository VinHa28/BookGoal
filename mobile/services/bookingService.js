import api from "../config/api";
import { getAuthHeader } from "../utils/utils";

export const getUserBookings = async (filters = {}) => {
  try {
    const headers = await getAuthHeader();
    const res = await api.post("/bookings/my", filters, { headers });
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching bookings:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLatestBooking = async () => {
  try {
    const headers = await getAuthHeader();
    const res = await api.get("/bookings/my-latest", { headers });
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching latest booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createBooking = async (fieldId, date, timeSlot) => {
  try {
    const headers = await getAuthHeader();
    const res = await api.post(
      "/bookings",
      { fieldId, date, timeSlot },
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error creating booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const headers = await getAuthHeader();
    const res = await api.put(`/bookings/cancel/${bookingId}`, {}, { headers });
    return res.data;
  } catch (error) {
    console.error(
      "Error cancelling booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};
