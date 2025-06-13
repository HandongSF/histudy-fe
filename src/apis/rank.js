import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getAllTeamsForRank = async () => {
  const response = await axiosInstance.get(`/api/public/teams`);
  return response;
};

export const ImageUploadApi = async (reportIdOr, formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACK_BASE_URL}/api/team/reports${
      reportIdOr === null ? "" : `/${reportIdOr}`
    }/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  return response;
};
