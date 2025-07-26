import type { User } from "../types/user.type";

export const LocalStorageEventTarget = new EventTarget();

export const getAccessTokenToLS = () => {
  return localStorage.getItem("access_token") || "";
};

export const setAccessTokenFromLS = (access_token: string) => {
  return localStorage.setItem("access_token", access_token);
};

export const clearAccessTokenFromLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
  localStorage.removeItem("refresh_token");
  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem("refresh_token", refresh_token);
};
export const getRefreshTokenFromLS = () => {
  return localStorage.getItem("refresh_token") || "";
};
