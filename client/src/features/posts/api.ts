import axiosInstance from "@shared/api/axios";
import { PostItem } from "@shared/types/types";

export const postsApi = {
  create: (data: { title: string; text: string }): Promise<PostItem> =>
    axiosInstance.post("/posts", data).then((r) => r.data),

  update: (
    id: string,
    data: { title: string; text: string; status?: boolean }
  ): Promise<void> => axiosInstance.patch(`/posts/${id}`, data).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosInstance.delete(`/posts/${id}`).then((r) => r.data),
};
