import { useAuth } from "@features/auth/useAuth";
import { Profile } from "./components/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { DefaultUrls, UserStatus } from "@shared/types/enums";
import { Navigation } from "@shared/ui/Navigation/Navigation";
import styles from "./style.module.scss";

const NAV_LINKS = [
  { name: "Content", path: `/${DefaultUrls.main}` },
  { name: "Bank", path: `/${DefaultUrls.bank}` },
  { name: "Calendar", path: `/${DefaultUrls.calendar}`},
  { name: "Training", path: `/${DefaultUrls.training}`},
  { name: "Movies", path: `/${DefaultUrls.movies}`},
];

export const Header = () => {
  const { onLogout } = useAuth();
  const { status } = useSelector((state: RootState) => state.user);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.headerLogo} href="/">
          <span className={styles.headerLogoBadge}>EP</span>
          <span className={styles.headerLogoName}>Egor Prus</span>
        </a>
        {status === UserStatus.success && (
          <div className={styles.headerNav}>
            <Navigation navigationList={NAV_LINKS} />
          </div>
        )}
        <Profile onLogout={onLogout} />
      </div>
    </header>
  );
};
