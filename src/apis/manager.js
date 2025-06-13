import axios from "axios";
import axiosInstance from "./axiosInstance";

export const readAllGroups = async () => {
  const response = await axiosInstance.get(`/api/admin/manageGroup`);
  return response;
};

export const readAllUsers = async () => {
  const response = await axiosInstance.get(`/api/admin/allUsers`);
  return response;
};

export const readGroupReport = async (id) => {
  const response = await axiosInstance.get(`/api/admin/groupReport/${id}`);
  return response;
};

export const readApplicants = async () => {
  const response = await axiosInstance.get(`/api/admin/users/unassigned`);
  return response;
};

export const autoCourses = async () => {
  const response = await axiosInstance.get(`/api/courses`);
  return response;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.post(`/api/courses/delete`, {
    id: id,
  });
  return response;
};

export const readReportDetail = async (reportId) => {
  const response = await axiosInstance.get(`/api/team/reports/${reportId}`);
  return response;
};

export const teamMatch = async () => {
  const response = await axiosInstance.post(`/api/admin/team-match`, {});
  return response;
};

export const readUngroup = async () => {
  const response = await axiosInstance.get(`/api/admin/unmatched-users`);
  return response;
};

export const deleteUserForm = async (sid) => {
  const response = await axiosInstance.delete(`/api/admin/form?sid=${sid}`);
  return response;
};

export const editUser = async (data) => {
  const response = await axiosInstance.post(`/api/admin/edit-user`, data);
  return response;
};
