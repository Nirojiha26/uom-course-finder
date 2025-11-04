import axios from "axios";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.API_URL || process.env.API_URL || "http://192.168.86.122:5194/api";

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============= API CALLS =============

// 1️⃣ Get all courses
export const getCourses = async () => {
  const res = await api.get("/Courses");
  return res.data;
};

// 2️⃣ Get course by ID
export const getCourseById = async (id: string) => {
  const res = await api.get(`/Courses/${id}`);
  return res.data;
};

// Export axios instance if needed elsewhere
export default api;
