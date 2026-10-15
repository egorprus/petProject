import { Link } from "react-router-dom";
import { UserData } from "@shared/types/types";
import { DefaultUrls } from "@shared/types/enums";
import { UserAvatar } from "@shared/ui/UserAvatar/UserAvatar";
import styles from '../style.module.scss';

interface Props {
	user: UserData | null;
	handleClick: () => void;
}
export const ActiveProfile = ({user, handleClick}: Props) => {
  return (
    <>
      <Link className={styles.profileUser} to={`/${DefaultUrls.profile}`}>
        <UserAvatar login={user?.login} avatarUrl={user?.avatarUrl} />
        <span className={styles.profileName}>{user?.login}</span>
      </Link>
      <button className={styles.profileLogout} type="button" onClick={handleClick}>
        Log out
      </button>
    </>
  );
};
