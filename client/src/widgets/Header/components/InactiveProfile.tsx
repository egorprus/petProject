import { Link } from "react-router-dom";
import styles from '../style.module.scss';

export const InactiveProfile = () => {
  return (
    <>
      <Link className={styles.profileLogout} to={"/auth"}>
        Sign in
      </Link>
      <Link className={styles.profileLogin} to={"/registration"}>
        Sign up
      </Link>
    </>
  );
};
