// src/api/axiosInstance.ts

import axios, { InternalAxiosRequestConfig } from 'axios';

export const requestHandler = async (config: InternalAxiosRequestConfig) => {
   const token = localStorage.getItem('accessToken');
   if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
   }

   return config;
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_BACK_BASE_URL, // 실제 API 주소로 교체
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
});

// 응답 인터셉터 적용
axiosInstance.interceptors.request.use(requestHandler);

export default axiosInstance;
