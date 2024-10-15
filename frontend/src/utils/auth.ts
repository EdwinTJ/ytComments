export const clearStoredTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
};

export const handleInsufficientPermissions = () => {
  clearStoredTokens();
  window.location.href = "/login";
};
