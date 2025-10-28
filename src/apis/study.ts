import { Course } from 'src/interface/course';
import { SimpleUser } from 'src/interface/user';
import axiosInstance from '../utils/axiosInstance';

interface StudyEnrollmentRequest {
   courseIds: number[];
   friendIds: number[];
}

export interface StudyEnrollmentResponse {
   friends: SimpleUser[];
   courses: Course[];
}

export const studyEnrollment = async (data: StudyEnrollmentRequest): Promise<StudyEnrollmentResponse> => {
   const response = await axiosInstance.post(`/api/v2/forms`, data);
   return response.data;
};

export const getMyGroup = async (): Promise<StudyEnrollmentResponse> => {
   const response = await axiosInstance.get(`/api/v2/users/me/forms`);
   return response.data;
};
