import type { AuthResponse } from "../types/auth.type";
import http from "../ultils/http";

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>("/registerr", body);
