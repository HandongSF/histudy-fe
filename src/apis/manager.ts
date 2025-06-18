import { Group } from "src/interface/group";
import axiosInstance from "./axiosInstance";
import { SimpleUser, StudyApplyUser, UnAssignedUser } from "src/interface/user";
import { Report, SimpleReport } from "src/interface/report";

interface EditUserRequest {
  id: number;
  team: number;
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

export const readAllStudyApplyUsers = async (): Promise<StudyApplyUser[]> => {
  const response = await axiosInstance.get(`/api/admin/allUsers`);
  return response.data;
};

export const readGroupReport = async (
  id: number
): Promise<GroupReportResponse> => {
  const response = await axiosInstance.get(`/api/admin/groupReport/${id}`);
  return response.data;
};

export const readApplicants = async (): Promise<UnAssignedUser[]> => {
  const response = await axiosInstance.get(`/api/admin/users/unassigned`);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await axiosInstance.post(`/api/courses/delete`, {
    id: id,
  });
  return response.data;
};

export const readReportDetail = async (reportId: number): Promise<Report> => {
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
