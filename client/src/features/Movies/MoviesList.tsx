import { MovieActionAdd } from "@features/Movies/MovieActionAdd";
import { FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import { MovieFormData } from "@shared/types/types";
import { GENRE_LABELS } from "@features/Movies/movieOptions";
import styles from "@pages/Movies/style.module.scss";

interface Props {
  movies: MovieFormData[];
  readOnly?: boolean;
  onEdit?: (id: string, data: MovieFormData) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (item: MovieFormData) => void;
}

export const MoviesList = ({ movies, readOnly, onEdit, onDelete, onToggleFavorite }: Props) => (
  <ul className={styles.list}>
    {movies.map((movie) => (
      <li key={movie._id} className={styles.listItem}>
        {readOnly ? (
          movie.favorite && <FaStar size={16} color="#f5b301" />
        ) : (
          <button className={styles.iconButton} onClick={() => onToggleFavorite?.(movie)}>
            {movie.favorite ? <FaStar size={16} color="#f5b301" /> : <FaRegStar size={16} />}
          </button>
        )}
        <span className={styles.itemLabel}>
          <strong>{movie.title}</strong>
          {movie.isSeries && <span>Сериал</span>}
          <span>{GENRE_LABELS[movie.genre] ?? movie.genre}</span>
          <span>{movie.notWatched ? "Не просмотрено" : movie.rating ? `★ ${movie.rating}` : "—"}</span>
        </span>
        {!readOnly && (
          <>
            <MovieActionAdd item={movie} onSubmit={(data) => onEdit?.(movie._id!, data)} />
            <button className={styles.iconButton} onClick={() => onDelete?.(movie._id!)}>
              <FaTrash size={18} />
            </button>
          </>
        )}
      </li>
    ))}
  </ul>
);
