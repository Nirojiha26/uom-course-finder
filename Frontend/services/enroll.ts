import api from "./api";

export const enrollCourse = (courseId: string) =>
  api.post(`/enroll/${courseId}`);

export const getMyCourses = () =>
  api.get("/enroll/my-courses").then(res => res.data);
