// services/enroll.ts
import api from "./api";

export const enrollCourse = (courseId: string) =>
  api.post(`/Enroll/${courseId}`);

export const getMyCourses = async () => {
  const res = await api.get("/Enroll/my-courses");
  return res.data; // returns array of enrolled courses
};
