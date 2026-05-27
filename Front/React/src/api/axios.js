import axios from "axios";
import { userInfoKey } from "../utils/utils";

const refreshPath = "auth/refresh";

export const loginClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(
      localStorage.getItem(userInfoKey) || "null",
    ).info;
    const accessToken = userInfo?.accessToken || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // access token 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh token으로 access token 재발급
        const userInfo = JSON.parse(
          localStorage.getItem(userInfoKey) || "null",
        ).info;
        const refreshToken = userInfo?.refreshToken || "";
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/${refreshPath}`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // 새 토큰 저장
        localStorage.setItem(
          userInfoKey,
          JSON.stringify({
            ...userInfo,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }),
        );

        // 원래 요청에 새 토큰 적용
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 실패했던 요청 재시도
        return client(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료됐을 경우
        localStorage.removeItem(userInfoKey);

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
