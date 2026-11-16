import styles from "./style.module.scss";

interface Props {
  login?: string;
  avatarUrl?: string;
  className?: string;
}

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const resolveUrl = (url: string) => (/^https?:\/\//.test(url) ? url : `${API_URL}${url}`);

export const UserAvatar = ({ login, avatarUrl, className }: Props) => {
  return (
    <span className={`${styles.avatar} ${className || ""}`}>
      {avatarUrl ? (
        <img className={styles.image} src={resolveUrl(avatarUrl)} alt={login} />
      ) : (
        login?.[0]
      )}
    </span>
  );
};
