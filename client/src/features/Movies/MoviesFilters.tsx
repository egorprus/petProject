import { MovieGenre } from "@shared/types/enums";
import { SelectField } from "@shared/ui/Fields/Select/SelectField";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { GENRE_OPTIONS, RATING_OPTIONS } from "@features/Movies/movieOptions";
import { MovieFilters, MovieSortBy, MovieTypeFilter, SortDirection } from "@features/Movies/useMoviesData";
import styles from "@pages/Movies/style.module.scss";

interface Props {
  sortBy: MovieSortBy;
  sortDir: SortDirection;
  onSortByChange: (value: MovieSortBy) => void;
  onSortDirToggle: () => void;
  filters: MovieFilters;
  onFilterGenreChange: (value: MovieGenre | "all") => void;
  onFilterRatingChange: (value: string | "all") => void;
  onFilterTypeChange: (value: MovieTypeFilter) => void;
  onFavoriteOnlyToggle: () => void;
}

const SORT_OPTIONS: { value: MovieSortBy; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "rating", label: "Rating" },
  { value: "genre", label: "Genre" },
];

const GENRE_FILTER_OPTIONS: { value: MovieGenre | "all"; label: string }[] = [
  { value: "all", label: "Все жанры" },
  ...GENRE_OPTIONS,
];

const RATING_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Любая оценка" },
  ...RATING_OPTIONS,
];

const TYPE_FILTER_OPTIONS: { value: MovieTypeFilter; label: string }[] = [
  { value: "all", label: "Всё" },
  { value: "movie", label: "Фильм" },
  { value: "series", label: "Сериал" },
];

interface FormValues {
  sortBy: MovieSortBy;
  filterGenre: MovieGenre | "all";
  filterRating: string;
  filterType: MovieTypeFilter;
}

export const MoviesFilters = ({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirToggle,
  filters,
  onFilterGenreChange,
  onFilterRatingChange,
  onFilterTypeChange,
  onFavoriteOnlyToggle,
}: Props) => {
  const { register } = useForm<FormValues>({
    defaultValues: {
      sortBy,
      filterGenre: filters.genre,
      filterRating: filters.rating,
      filterType: filters.type,
    },
  });

  return (
    <>
      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>Sort by</span>
        <div className={styles.selectWrap}>
          <SelectField
            options={SORT_OPTIONS}
            errors={undefined}
            register={register("sortBy")}
            onChange={(option) => option && onSortByChange(option.value)}
          />
        </div>
        <button className={`${styles.iconButton} ${styles.sortDirButton}`} onClick={onSortDirToggle}>
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <div className={styles.filterRow}>
        <span className={styles.sortLabel}>Фильтры</span>
        <div className={styles.selectWrap}>
          <SelectField
            options={GENRE_FILTER_OPTIONS}
            errors={undefined}
            register={register("filterGenre")}
            onChange={(option) => onFilterGenreChange(option ? option.value : "all")}
          />
        </div>
        <div className={styles.selectWrap}>
          <SelectField
            options={RATING_FILTER_OPTIONS}
            errors={undefined}
            register={register("filterRating")}
            onChange={(option) => onFilterRatingChange(option ? option.value : "all")}
          />
        </div>
        <div className={styles.selectWrap}>
          <SelectField
            options={TYPE_FILTER_OPTIONS}
            errors={undefined}
            register={register("filterType")}
            onChange={(option) => onFilterTypeChange(option ? option.value : "all")}
          />
        </div>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.sortDirButton} ${
            filters.favoriteOnly ? styles.filterActive : ""
          }`}
          onClick={onFavoriteOnlyToggle}
          title="Только избранное"
        >
          {filters.favoriteOnly ? <FaStar size={16} color="#f5b301" /> : <FaRegStar size={16} />}
        </button>
      </div>
    </>
  );
};
