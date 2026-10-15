import { isAxiosError } from "axios";
import axiosInstance from "@shared/api/axios";
import { ChangePasswordData, ProfileFormData, UserData } from "@shared/types/types";

export const profileApi = {
  updateMe: (data: ProfileFormData): Promise<UserData> =>
    axiosInstance.patch("/auth/me", data).then((r) => r.data),

  changePassword: (data: ChangePasswordData): Promise<void> =>
    axiosInstance.patch("/auth/me/password", data).then((r) => r.data),

  uploadAvatar: (file: File): Promise<UserData> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosInstance.post("/auth/me/avatar", formData).then((r) => r.data);
  },
};

/** Server answers either { message } or an express-validator errors array */
export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (Array.isArray(data) && data[0]?.msg) return data[0].msg;
    if (data?.message) return data.message;
    if (err.response) return `Ошибка сервера (${err.response.status})`;
  }
  return "Что-то пошло не так";
};
