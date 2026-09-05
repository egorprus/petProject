import { MovieGenre } from "@shared/types/enums";

export const GENRE_OPTIONS = [
  { value: MovieGenre.action, label: "Action" },
  { value: MovieGenre.comedy, label: "Comedy" },
  { value: MovieGenre.drama, label: "Drama" },
  { value: MovieGenre.horror, label: "Horror" },
  { value: MovieGenre.sciFi, label: "Sci-Fi" },
  { value: MovieGenre.fantasy, label: "Fantasy" },
  { value: MovieGenre.thriller, label: "Thriller" },
  { value: MovieGenre.romance, label: "Romance" },
  { value: MovieGenre.documentary, label: "Documentary" },
  { value: MovieGenre.animation, label: "Animation" },
  { value: MovieGenre.other, label: "Other" },
];

export const GENRE_LABELS: Record<string, string> = Object.fromEntries(
  GENRE_OPTIONS.map((option) => [option.value, option.label])
);

export const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const value = String(10 - i);
  return { value, label: value };
});
