import { Group } from 'src/interface/group';
import axiosInstance from '../utils/axiosInstance';
import { SimpleUser, StudyEnrollee, UnAssignedUser } from 'src/interface/user';
import { Report, SimpleReport } from 'src/interface/report';

export interface EditUserRequest {
   id: number;
   team: number | null;
   name: string;
   sid: string;
}

interface GroupReportResponse {
   group: number;
   tag: number;
   members: SimpleUser[];
   totalTime: number;
   reports: SimpleReport[];
}

export const readAllGroups = async (): Promise<Group[]> => {
   const response = await axiosInstance.get(`/api/admin/manageGroup`);
   return response.data;
};

export const readAllStudyEnrollees = async (): Promise<StudyEnrollee[]> => {
   const response = await axiosInstance.get(`/api/admin/allUsers`);
   return response.data;
};

export const readGroupReport = async (id: number): Promise<GroupReportResponse> => {
   const response = await axiosInstance.get(`/api/admin/groupReport/${id}`);
   return response.data;
};

export const readStudyEnrollees = async (): Promise<UnAssignedUser[]> => {
   const response = await axiosInstance.get(`/api/admin/users/unassigned`);
   return response.data;
};

export const deleteCourse = async (id: number) => {
   const response = await axiosInstance.post(`/api/courses/delete`, {
      id: id,
   });
   return response.data;
};

export const readReport = async (reportId: number): Promise<Report> => {
   const response = await axiosInstance.get(`/api/team/reports/${reportId}`);
   return response.data;
};

export const teamMatch = async () => {
   const response = await axiosInstance.post(`/api/admin/team-match`, {});
   return response;
};

export const readUngroup = async (): Promise<UnAssignedUser[]> => {
   const response = await axiosInstance.get(`/api/admin/unmatched-users`);
   return response.data;
};

export const deleteUserForm = async (sid: string) => {
   const response = await axiosInstance.delete(`/api/admin/form?sid=${sid}`);
   return response;
};

export const editUser = async (data: EditUserRequest) => {
   const response = await axiosInstance.post(`/api/admin/edit-user`, data);
   return response;
};
