import { Course } from "src/interface/course";
import { SimpleUser } from "src/interface/user";
import axiosInstance from "../utils/axiosInstance";

interface StudyEnrollRequest {
  courseIds: number[];
  friendIds: number[];
}

export interface StudyEnrollResponse {
  friends: SimpleUser[];
  courses: Course[];
}

export const studyEnroll = async (
  data: StudyEnrollRequest
): Promise<StudyEnrollResponse> => {
  const response = await axiosInstance.post(`/api/v2/forms`, data);
  return response.data;
};

export const getMyGroup = async (): Promise<StudyEnrollResponse> => {
  const response = await axiosInstance.get(`/api/v2/users/me/forms`);
  return response.data;
};
