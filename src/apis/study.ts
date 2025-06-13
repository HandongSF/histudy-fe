import { Course } from "src/interface/course";
import { SimpleUser } from "src/interface/user";
import axiosInstance from "./axiosInstance";

interface StudyEnrollRequest {
  courseIds: number[];
  friendIds: string;
}

interface StudyEnrollResponse {
  friends: SimpleUser[];
  courses: Course[];
}

export const studyEnroll = async (
  data: StudyEnrollRequest
): Promise<StudyEnrollResponse> => {
  const response = await axiosInstance.post(`/api/forms`, data);
  return response.data;
};

export const getMyGroup = async (): Promise<StudyEnrollResponse> => {
  const response = await axiosInstance.get(`/api/users/me/forms`);
  return response.data;
};
