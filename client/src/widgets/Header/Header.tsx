import { useEffect, useState } from "react";
import { useAuth } from "@features/auth/useAuth";
import { Profile } from "./components/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { UserStatus } from "@shared/types/enums";
import { NavItem } from "@shared/types/types";
import { Navigation } from "@shared/ui/Navigation/Navigation";
import { profileApi } from "@features/Profile/api";
import styles from "./style.module.scss";

export const Header = () => {
  const { onLogout } = useAuth();
  const { status, data } = useSelector((state: RootState) => state.user);
  const [navList, setNavList] = useState<NavItem[]>([]);

  // Refetch when settings change hiddenPage (updateUser in the store)
  const hiddenKey = data?.hiddenPage?.join(",");

  useEffect(() => {
    if (status !== UserStatus.success) {
      return;
    }
    profileApi
      .getPages(true)
      .then((pages) => setNavList(pages.map(({ key, name }) => ({ name, path: `/${key}` }))))
      .catch(() => setNavList([]));
  }, [status, hiddenKey]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.headerLogo} href="/">
          <span className={styles.headerLogoBadge}>EP</span>
          <span className={styles.headerLogoName}>Egor Prus</span>
        </a>
        {status === UserStatus.success && (
          <div className={styles.headerNav}>
            <Navigation navigationList={navList} />
          </div>
        )}
        <Profile onLogout={onLogout} />
      </div>
    </header>
  );
};
