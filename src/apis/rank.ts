import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { Teams } from "../interface/teams";

export const getAllTeamsForRank = async (): Promise<Teams> => {
  const response = await axiosInstance.get(`/api/public/teams`);
  return response.data;
};

export const ImageUploadApi = async (
  reportIdOr: number | null,
  formData: FormData
) => {
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
