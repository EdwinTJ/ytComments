export const getEnvConfig = () => {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  };
};
