import api from "../config/api";
import { getAuthHeader } from "../utils/utils";

export const getNotifications = async () => {
  try {
    const headers = await getAuthHeader();
    const res = await api.get(`/notifications/my`, {}, { headers });
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
};

export const getUnreadNotifications = async () => {
  try {
    const headers = await getAuthHeader();
    const res = await api.get("/notifications/unread", {}, { headers });
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
};

export const markIsReaded = async (notificationId) => {
  try {
    const headers = await getAuthHeader();
    await api.post(
      "/notifications/mark-readed",
      { notificationId },
      { headers }
    );
  } catch (error) {
    console.error("Error updating notification", error);
    throw error;
  }
};
