import type { User } from "../types/user.type";
import type { SuccessResponseApi } from "../types/utils.type";
import http from "../ultils/http";

interface BodyUpdateProfile
  extends Omit<User, "_id" | "email" | "createdAt" | "updatedAt" | "roles"> {
  password?: string;
  newPassword?: string;
}

const userApi = {
  getProfile() {
    return http.get<SuccessResponseApi<User>>("me");
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponseApi<User>>("user", body);
  },
  uploadAvatar(body: FormData) {
    return http.post("update-avatar", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default userApi;
