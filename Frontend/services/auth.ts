import api from "./api";

export const registerUser = (data: any) => api.post("/Auth/register", data);
export const verifyOtp = (data: any) => api.post("/Auth/verify-email", data);
export const loginUser = (data: any) => api.post("/Auth/login", data);
export const forgotPassword = (data: any) => api.post("/Auth/forgot-password", data);
export const resetPassword = (data: any) => api.post("/Auth/reset-password", data);
export const getProfile = () => api.get("/profile");
export const updateProfile = (data: any) => api.put("/profile", data);
