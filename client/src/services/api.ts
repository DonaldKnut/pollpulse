import axios, { AxiosError } from "axios";

// Create an Axios instance with base URL and credentials enabled
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api", // Example: https://pollpulse-server.onrender.com/api
  withCredentials: true, // Sends the HTTP-only refreshToken cookie
});

// Request interceptor: add access token from localStorage to Authorization header
api.interceptors.request.use((config) => {
  const storedAccessToken = localStorage.getItem("token");
  if (storedAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${storedAccessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 errors by attempting token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Only handle 401 if it's not a login or refresh request and not already retried
    const isUnauthorized = error.response?.status === 401;
    const isFirstAttempt = !originalRequest._retry;
    const isNotLoginOrRefresh =
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh");

    if (isUnauthorized && isFirstAttempt && isNotLoginOrRefresh) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh access token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        if (!newAccessToken) {
          throw new Error("No access token returned from refresh.");
        }

        // Save new token and update request headers
        localStorage.setItem("token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_expiry");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If not a token error, just reject as usual
    return Promise.reject(error);
  }
);

export default api;
