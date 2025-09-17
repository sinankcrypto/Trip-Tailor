import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true, 
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not retried yet → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          "http://localhost:8000/api/token/refresh-cookie/",
          {},
          { withCredentials: true }
        );

        // Retry the original request with new cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;