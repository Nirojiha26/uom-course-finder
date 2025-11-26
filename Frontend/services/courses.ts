import api from "./api";

export const getCourses = async () => {
  const res = await api.get("/Courses");
  return res.data;
};
export const getCourseById = async (id: string) => {
  const res = await api.get(`/Courses/${id}`);
  return res.data;
};

export const enrollCourse = async (courseId: string) => {
  // Endpoint: POST /Courses/{id}/enroll (adjust if your backend uses a different route)
  const res = await api.post(`/Courses/${courseId}/enroll`);
  return res.data;
};
