import { NewReport, Reports } from "src/interface/report";
import axiosInstance from "../utils/axiosInstance";

export const postReport = async (data: NewReport) => {
  const response = await axiosInstance.post(`/api/team/reports`, data);
  return response;
};

export const getMyTeamReport = async (): Promise<Reports> => {
  const response = await axiosInstance.get(`/api/team/reports`);
  return response.data;
};

export const deleteReport = (reportId: number) => {
  const response = axiosInstance.delete(`/api/team/reports/${reportId}`);
  return response;
};

export const modifyReport = (reportId: number, data: NewReport) => {
  const response = axiosInstance.patch(`/api/team/reports/${reportId}`, data);
  return response;
};
