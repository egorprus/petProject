import axiosInstance from "@shared/api/axios";
import { MovieFormData } from "@shared/types/types";

type MoviePayload = Omit<MovieFormData, "_id">;

export const moviesApi = {
  getAll: (): Promise<MovieFormData[]> =>
    axiosInstance.get("/movie-records").then((r) => r.data),

  create: (data: MoviePayload): Promise<MovieFormData> =>
    axiosInstance.post("/movie-records", data).then((r) => r.data),

  update: (id: string, data: MoviePayload): Promise<void> =>
    axiosInstance.patch(`/movie-records/${id}`, data).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosInstance.delete(`/movie-records/${id}`).then((r) => r.data),
};
