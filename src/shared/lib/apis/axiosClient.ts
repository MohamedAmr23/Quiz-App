import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://upskilling-egypt.com:3005/api";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const SKIP_LOGOUT_URLS = [
  "/auth/login",
  "/auth/change-password",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const shouldSkip = SKIP_LOGOUT_URLS.some((url) =>
        requestUrl.includes(url)
      );
      if (!shouldSkip) {
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

export function handleLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");

    // Clear auth cookie so middleware redirects to login
    document.cookie = "accessToken=; path=/; max-age=0";

    window.location.href = "/login";
  }
}