export const getAccessTokenToLS = () => {
  return localStorage.getItem("access_token") || "";
};

export const setAccessTokenFromLS = (access_token: string) => {
  return localStorage.setItem("access_token", access_token);
};

export const clearAccessTokenFromLS = () => {
  return localStorage.removeItem("access_token");
};
