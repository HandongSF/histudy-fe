// src/api/axiosInstance.ts

import axios, { AxiosError } from "axios";
import { tokenRefresh } from "./auth";

const TOKEN = localStorage.getItem("accessToken");
// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACK_BASE_URL, // 실제 API 주소로 교체
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 응답 인터셉터 적용
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("?");
    return response.data;
  },

  async (error) => {
    const err = error;
    if (err.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await tokenRefresh(refreshToken).then((res) => {
        localStorage.setItem("accessToken", res.token);
        window.location.reload();
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
