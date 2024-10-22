// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import axios, { AxiosInstance } from "axios";
import { getEnvConfig } from "@/config/env";

const { VITE_API_URL } = getEnvConfig();

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userData: any | null;
  isAuthenticated: boolean;
  api: AxiosInstance;
  login: (
    name: string,
    email: string,
    channelId: string,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [userData, setUserData] = useState<any | null>(
    JSON.parse(localStorage.getItem("userData") || "null")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!accessToken
  );

  const api = axios.create({
    baseURL: VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Set up axios interceptors
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      console.log("Outgoing request:", config.method, config.url);
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => {
      console.log("Response received:", response.status, response.config.url);
      return response;
    },
    async (error) => {
      console.error(
        "Response error:",
        error.response?.status,
        error.config.url
      );

      if (
        error.response?.status === 403 &&
        error.response?.data?.detail ===
          "Insufficient authentication scopes. Please log in again."
      ) {
        await logout();
        return Promise.reject(error);
      }

      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          await logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const login = (
    name: string,
    email: string,
    channelId: string,
    newAccessToken: string,
    newRefreshToken: string
  ) => {
    const userDataObj = { name, email, channel_id: channelId };
    setUserData(userDataObj);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);

    localStorage.setItem("userData", JSON.stringify(userDataObj));
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const loginWithGoogle = () => {
    window.location.href = `${VITE_API_URL}/auth/login`;
  };

  const logout = async () => {
    try {
      await api.get("/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUserData(null);
      setIsAuthenticated(false);

      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post(`${VITE_API_URL}/api/refresh_token`, {
        refresh_token: refreshToken,
      });
      const { access_token } = response.data;
      setAccessToken(access_token);
      localStorage.setItem("accessToken", access_token);
      return access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await logout();
      return null;
    }
  };

  const value = {
    accessToken,
    refreshToken,
    userData,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
    loginWithGoogle,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
