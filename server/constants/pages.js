// Pages a user can hide from the header nav. `key` is also the client route.
export const PAGES = [
  { key: "content", name: "Content" },
  { key: "bank", name: "Bank" },
  { key: "calendar", name: "Calendar" },
  { key: "training", name: "Training" },
  { key: "movies", name: "Movies" },
];

export const PAGE_KEYS = PAGES.map((page) => page.key);
