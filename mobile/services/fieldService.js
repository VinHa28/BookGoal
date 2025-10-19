import api from "../config/api";

export const getFields = async () => {
  try {
    const res = await api.get("/fields");
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching fields:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFieldById = async (id) => {
  try {
    const res = await api.get(`/fields/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching field:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllSlots = async (id, date) => {
  try {
    const res = await api.get(`/fields/${id}/all-slots`, {
      params: { date },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching all slots: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
