import type { AuthResponse } from "../types/auth.type";
import http from "../ultils/http";

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>("/register", body);

export const login = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>("/login", body);
};
