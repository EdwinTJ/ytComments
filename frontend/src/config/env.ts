export const getEnvConfig = () => {
  return {
    VITE_API_URL:
      import.meta.env.VITE_API_URL || "https://ytcomments-hs2i.onrender.com",
  };
};
