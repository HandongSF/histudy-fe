import axiosInstance from "./axiosInstance";

export const studyEnroll = async (data) => {
  const response = await axiosInstance.post(`/api/forms`, data);
  return response;
};

export const getMyGroup = async () => {
  const response = await axiosInstance.get(`/api/users/me/forms`);
  return response;
};
