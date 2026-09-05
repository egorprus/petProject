import { MovieFormData } from "@shared/types/types";
import { MovieGenre } from "@shared/types/enums";
import { useEffect, useMemo, useState } from "react";
import { moviesApi } from "./api";

export type MovieSortBy = "title" | "rating" | "genre";
export type SortDirection = "asc" | "desc";
export type MovieTypeFilter = "all" | "movie" | "series";

export interface MovieFilters {
  genre: MovieGenre | "all";
  rating: string | "all";
  type: MovieTypeFilter;
  favoriteOnly: boolean;
}

const DEFAULT_FILTERS: MovieFilters = {
  genre: "all",
  rating: "all",
  type: "all",
  favoriteOnly: false,
};

export const useMoviesData = () => {
  const [movies, setMovies] = useState<MovieFormData[]>([]);
  const [sortBy, setSortBy] = useState<MovieSortBy>("title");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    moviesApi.getAll().then((data) => setMovies(Array.isArray(data) ? data : []));
  }, []);

  const setFilterGenre = (genre: MovieGenre | "all") =>
    setFilters((prev) => ({ ...prev, genre }));

  const setFilterRating = (rating: string | "all") =>
    setFilters((prev) => ({ ...prev, rating }));

  const setFilterType = (type: MovieTypeFilter) =>
    setFilters((prev) => ({ ...prev, type }));

  const toggleFavoriteOnly = () =>
    setFilters((prev) => ({ ...prev, favoriteOnly: !prev.favoriteOnly }));

  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) => {
        if (filters.genre !== "all" && movie.genre !== filters.genre) return false;
        if (filters.rating !== "all" && movie.rating !== filters.rating) return false;
        if (filters.type === "movie" && movie.isSeries) return false;
        if (filters.type === "series" && !movie.isSeries) return false;
        if (filters.favoriteOnly && !movie.favorite) return false;
        return true;
      }),
    [movies, filters]
  );

  const sortedMovies = useMemo(() => {
    const sorted = [...filteredMovies].sort((a, b) => {
      if (sortBy === "rating") {
        return (Number(a.rating) || 0) - (Number(b.rating) || 0);
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [filteredMovies, sortBy, sortDir]);

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
    movies: sortedMovies,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,
    filters,
    setFilterGenre,
    setFilterRating,
    setFilterType,
    toggleFavoriteOnly,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleFavorite,
  };
};
