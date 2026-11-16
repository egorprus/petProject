import styles from "./style.module.scss";
import { MovieActionAdd } from "@features/Movies/MovieActionAdd";
import { ShareMoviesLink } from "@features/Movies/ShareMoviesLink";
import { MoviesFilters } from "@features/Movies/MoviesFilters";
import { MoviesList } from "@features/Movies/MoviesList";
import { useMoviesData } from "@features/Movies/useMoviesData";

export const MoviesPage = () => {
  const {
    movies,
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
  } = useMoviesData();

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1>Movies</h1>
          <div className={styles.titleActions}>
            <ShareMoviesLink />
            <MovieActionAdd onSubmit={handleAdd} />
          </div>
        </div>
      </div>

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

      <MoviesList
        movies={movies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
    </section>
  );
};
