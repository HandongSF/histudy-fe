import { Courses } from "src/interface/course";
import axiosInstance from "./axiosInstance";

export const importCourses = async (formData: FormData) => {
  const response = await axiosInstance.post("/api/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const teamCourses = async (): Promise<Courses> => {
  const response = await axiosInstance.get("/api/team/courses");
  return response.data;
};

export const autoCourses = async (): Promise<Courses> => {
  const response = await axiosInstance.get("/api/courses");
  return response.data;
};
