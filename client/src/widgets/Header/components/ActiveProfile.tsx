import { Link } from "react-router-dom";
import { UserData } from "@shared/types/types";
import styles from '../style.module.scss';

interface Props {
	user: UserData | null;
	handleClick: () => void;
}
export const ActiveProfile = ({user, handleClick}: Props) => {
  return (
    <>
      <Link className={styles.profileUser} to={`/${user?.login}`}>
        <span className={styles.profileAvatar}>{user?.login?.[0]}</span>
        <span className={styles.profileName}>{user?.login}</span>
      </Link>
      <button className={styles.profileLogout} type="button" onClick={handleClick}>
        Log out
      </button>
    </>
  );
};
