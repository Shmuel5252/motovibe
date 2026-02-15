import axios from "axios";
import { STORAGE_KEYS } from "../config/storageKeys.js";

const base = import.meta.env.VITE_API_BASE_URL;

// baseURL צריך להיות: http://localhost:5000/api
export const http = axios.create({
  baseURL: `${base}/api`,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401) {
      // ⚠️ נעילה: רק dispatchEvent. בלי store, בלי logout, בלי redirect.
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(err);
  }
);
