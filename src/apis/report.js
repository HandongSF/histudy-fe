import axiosInstance from "./axiosInstance";

export const postReport = async (data) => {
  const response = await axiosInstance.post(`/api/team/reports`, data);
  return response;
};

export const getMyTeamReport = async () => {
  const response = await axiosInstance.get(`/api/team/reports`);
  return response;
};

export const deleteReport = (reportId) => {
  const response = axiosInstance.delete(`/api/team/reports/${reportId}`);
  return response;
};

export const modifyReport = (reportId, data) => {
  const response = axiosInstance.patch(`/api/team/reports/${reportId}`, data);
  return response;
};
