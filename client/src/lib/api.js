import axios from "axios";
import { clearAuthSession, getAuthToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();

      if (window.location.pathname !== "/admin-login") {
        window.location.href = "/admin-login";
      }
    }

    return Promise.reject(error);
  },
);

export function unwrapApiResponse(response) {
  return response.data?.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error.response?.data;
  const validationErrors = responseData?.data;

  if (validationErrors && typeof validationErrors === "object" && !Array.isArray(validationErrors)) {
    const [firstField, firstMessage] = Object.entries(validationErrors)[0] || [];
    if (firstField && firstMessage) {
      return `${firstField}: ${firstMessage}`;
    }
  }

  return responseData?.message || fallbackMessage;
}

export default api;
