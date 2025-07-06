// hooks/useAxiosInterceptor.ts
import { useEffect } from "react";

import { useAuth } from "./auth";
import axiosInstance, { requestHandler } from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

export const useAxiosInterceptor = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // TODO: 한페이지에서 발생한 401, 403 중복 에러 발생 처리 필요.
  const errorHandler = async (error: AxiosError) => {
    const status = error.response?.status;
    console.log(error?.response);
    if (status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const res = await axiosInstance.post("/auth/refresh", { refreshToken });
        const newAccessToken = res.data.token;
        localStorage.setItem("accessToken", newAccessToken);
        window.location.reload();
      } catch {
        logout();
        return;
      }
    } else if (status === 403) {
      navigate(-1);
    }

    return Promise.reject(error);
  };

  const responseHandler = (response: AxiosResponse) => response;
  const responseInterceptor = axiosInstance.interceptors.response.use(
    responseHandler,
    errorHandler
  );
  const requestInterceptor =
    axiosInstance.interceptors.request.use(requestHandler);

  useEffect(() => {
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseInterceptor, requestInterceptor]);
};
