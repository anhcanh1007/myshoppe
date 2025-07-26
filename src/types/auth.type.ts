import type { User } from "./user.type";
import type { SuccessResponseApi } from "./utils.type";

export type AuthResponse = SuccessResponseApi<{
  access_token: string;
  expires: number;
  user: User;
  refresh_token: string;
  expires_refresh_token: number;
}>;

export type RefreshTokenReponse = SuccessResponseApi<{ access_token: string }>;
