// src/api/axiosInstance.ts

import { BACKEND_BASE_URL } from "@/const/endpoints";
import axios, { InternalAxiosRequestConfig } from "axios";

export const requestHandler = async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 응답 인터셉터 적용
axiosInstance.interceptors.request.use(requestHandler);

export default axiosInstance;
