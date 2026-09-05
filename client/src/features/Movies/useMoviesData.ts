import { MovieFormData } from "@shared/types/types";
import { useEffect, useState } from "react";
import { moviesApi } from "./api";
import { useMovieFilterSort } from "./useMovieFilterSort";

export const useMoviesData = () => {
  const [movies, setMovies] = useState<MovieFormData[]>([]);

  useEffect(() => {
    moviesApi.getAll().then((data) => setMovies(Array.isArray(data) ? data : []));
  }, []);

  const filterSort = useMovieFilterSort(movies);

  const handleAdd = async (data: MovieFormData) => {
    const created = await moviesApi.create(data);
    setMovies((prev) => [...prev, created]);
  };

  const handleEdit = async (id: string, data: MovieFormData) => {
    await moviesApi.update(id, data);
    setMovies((prev) => prev.map((item) => (item._id === id ? { ...data, _id: id } : item)));
  };

  const handleDelete = async (id: string) => {
    await moviesApi.remove(id);
    setMovies((prev) => prev.filter((item) => item._id !== id));
  };

  const handleToggleFavorite = async (item: MovieFormData) => {
    const favorite = !item.favorite;
    await moviesApi.update(item._id!, { ...item, favorite });
    setMovies((prev) => prev.map((m) => (m._id === item._id ? { ...m, favorite } : m)));
  };

  return {
    ...filterSort,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleFavorite,
  };
};
