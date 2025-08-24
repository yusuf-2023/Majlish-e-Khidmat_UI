// src/api/activityApi.js
import API from "../core/httpClient";

export const getActivities = async () => {
  try {
    const response = await API.get("/activities");
    return { data: response.data };
  } catch (error) {
    console.error("Error fetching activities:", error.response?.data || error.message);
    return { data: [] };
  }
};

export const addActivity = async (activityData) => {
  try {
    const response = await API.post("/activities", activityData);
    return response.data;
  } catch (error) {
    console.error("Error adding activity:", error.response?.data || error.message);
    return null;
  }
};

export const deleteActivity = async (id) => {
  try {
    await API.delete(`/activities/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting activity:", error.response?.data || error.message);
    return false;
  }
};
