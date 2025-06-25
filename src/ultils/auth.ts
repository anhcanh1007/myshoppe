import type { User } from "../types/user.type";

export const getAccessTokenToLS = () => {
  return localStorage.getItem("access_token") || "";
};

export const setAccessTokenFromLS = (access_token: string) => {
  return localStorage.setItem("access_token", access_token);
};

export const clearAccessTokenFromLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};
