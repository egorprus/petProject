import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { UserStatus } from "@shared/types/enums";
import { ActiveProfile } from "./ActiveProfile";
import { InactiveProfile } from "./InactiveProfile";
import styles from '../style.module.scss';

interface Props {
	onLogout: () => void;
}
export const Profile = ({ onLogout }: Props) => {
  const user = useSelector((state:RootState) => state.user);

  return (
    <div className={styles.profile}>
      {user.status === UserStatus.success ? (
        <ActiveProfile user={user.data} handleClick={onLogout} />
      ) : (
        <InactiveProfile />
      )}
    </div>
  );

};
