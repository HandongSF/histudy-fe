import axiosInstance from "./axiosInstance";

export const importCourses = async (formData) => {
  const response = await axiosInstance.post("/api/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const teamCourses = async () => {
  const response = await axiosInstance.get(`/api/team/courses`);
  return response;
};

export const autoCourses = async () => {
  const response = await axiosInstance.get("/api/courses");
  return response;
};
