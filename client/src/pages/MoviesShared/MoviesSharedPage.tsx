import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieFormData } from "@shared/types/types";
import { moviesApi } from "@features/Movies/api";
import { useMovieFilterSort } from "@features/Movies/useMovieFilterSort";
import { MoviesFilters } from "@features/Movies/MoviesFilters";
import { MoviesList } from "@features/Movies/MoviesList";
import styles from "./style.module.scss";

export const MoviesSharedPage = () => {
  const { token } = useParams<{ token: string }>();
  const [movies, setMovies] = useState<MovieFormData[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    moviesApi
      .getShared(token)
      .then((data) => setMovies(Array.isArray(data) ? data : []))
      .catch(() => setNotFound(true));
  }, [token]);

  const {
    movies: filteredMovies,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,
    filters,
    setFilterGenre,
    setFilterRating,
    setFilterType,
    toggleFavoriteOnly,
  } = useMovieFilterSort(movies ?? []);

  if (notFound) {
    return (
      <section className={styles.page}>
        <p>Ссылка недействительна или больше не активна.</p>
      </section>
    );
  }

  if (!movies) {
    return (
      <section className={styles.page}>
        <p>Загрузка...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1>Каталог фильмов</h1>

      <MoviesFilters
        sortBy={sortBy}
        sortDir={sortDir}
        onSortByChange={setSortBy}
        onSortDirToggle={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        filters={filters}
        onFilterGenreChange={setFilterGenre}
        onFilterRatingChange={setFilterRating}
        onFilterTypeChange={setFilterType}
        onFavoriteOnlyToggle={toggleFavoriteOnly}
      />

      <MoviesList movies={filteredMovies} readOnly />
    </section>
  );
};
