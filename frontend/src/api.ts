import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleInsufficientPermissions = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  window.location.href = "/login";
};

export const fetchUserData = async () => {
  try {
    const response = await api.get("/api/user");
    const userData = response.data;
    localStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Outgoing request:", config.method, config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("Response error:", error.response?.status, error.config.url);

    if (
      error.response?.status === 403 &&
      error.response?.data?.detail ===
        "Insufficient authentication scopes. Please log in again."
    ) {
      handleInsufficientPermissions();
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting token refresh");
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_BASE_URL}/api/refresh_token`, {
          refresh_token: refreshToken,
        });
        const { access_token } = response.data;
        localStorage.setItem("accessToken", access_token);
        api.defaults.headers["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        console.log("Token refreshed, retrying original request");
        await fetchUserData(); // Update user data after successful token refresh
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        handleInsufficientPermissions();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/login`;
};

export const fetchVideos = async () => {
  try {
    console.log("Fetching videos");
    const response = await api.get("/api/videos");
    console.log("Videos fetched successfully");
    return response.data.videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.get("/logout");
    handleInsufficientPermissions();
  } catch (error) {
    console.error("Error logging out:", error);
    handleInsufficientPermissions();
  }
};

export default api;
