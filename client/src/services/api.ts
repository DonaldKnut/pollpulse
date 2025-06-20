// src/config/api.ts

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api", // assumes your backend uses `/api` prefix
  withCredentials: true, // optional, only if using cookies
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
