import axios from "axios";
import axiosInstance from "./axiosInstance";
export const postReport = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACK_BASE_URL}/api/users`,
    data
  );
  return response;
};

export const userLogin = async (sub) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACK_BASE_URL}/api/auth/login?sub=${sub}`
  );
  return response;
};

export const userSignup = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACK_BASE_URL}/api/users`,
    data
  );
  return response.data;
};

export const autoUser = async (search) => {
  const response = await axiosInstance.get(`/api/users?search=${search}`);
  return response;
};

export const getMyTeamUsers = async () => {
  const response = await axiosInstance.get(`/api/team/users`);
  return response;
};

export const getProfile = async () => {
  const response = await axiosInstance.get(`/api/users/me`);
  return response;
};
