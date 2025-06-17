// src/api/axiosInstance.ts

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
  baseURL: import.meta.env.VITE_BACK_BASE_URL, // 실제 API 주소로 교체
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 응답 인터셉터 적용
axiosInstance.interceptors.request.use(requestHandler);

// 응답 인터셉터 설정
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },

//   async (error) => {
//     const err = error;
//     // TODO: 점검 필요
//     if (err.response?.status === 401) {
//       console.log(err.response);
//       // 토큰 만료 or 토큰 없음
//       const refreshToken = localStorage.getItem("refreshToken");
//       const { logout } = useAuth();
//       if (!refreshToken) {
//         logout();
//         return;
//       }
//       await tokenRefresh(refreshToken)
//         .then((res) => {
//           localStorage.setItem("accessToken", res.token);
//           window.location.reload();
//         })
//         .catch(() => {
//           logout();
//           return;
//         });
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
