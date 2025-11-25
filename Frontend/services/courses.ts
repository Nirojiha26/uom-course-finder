import api from "./api";

export const getCourses = async () => {
  const res = await api.get("/Courses");
  return res.data;
};
export const getCourseById = async (id: string) => {
  const res = await api.get(`/Courses/${id}`);
  return res.data;
};
