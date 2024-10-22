// src/contexts/SummaryContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface SummaryContextType {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  getSummary: (
    videoId: string,
    prompt: string,
    title?: string
  ) => Promise<void>;
  clearSummary: () => void;
}

const SummaryContext = createContext<SummaryContextType | null>(null);

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error("useSummary must be used within a SummaryProvider");
  }
  return context;
};

export const SummaryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { api } = useAuth();
  const navigate = useNavigate();

  const getSummary = async (
    videoId: string,
    prompt: string,
    title?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/summarize_comments", {
        video_id: videoId,
        prompt,
      });

      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError("Failed to fetch summary. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      if (err.response?.status === 401) {
        navigate("/login", {
          state: {
            message: "Please log in again to access this feature.",
          },
        });
      } else {
        setError(
          "An error occurred while fetching the summary. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearSummary = () => {
    setSummary(null);
    setError(null);
  };

  const value = {
    summary,
    isLoading,
    error,
    setError,
    getSummary,
    clearSummary,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
