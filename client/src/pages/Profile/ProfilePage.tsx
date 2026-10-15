import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@app/store";
import { AvatarUpload } from "@features/Profile/AvatarUpload";
import { ChangePasswordForm } from "@features/Profile/ChangePasswordForm";
import { ProfileInfoForm } from "@features/Profile/ProfileInfoForm";
import { DefaultUrls } from "@shared/types/enums";
import styles from "./style.module.scss";

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.data);

  if (!user) {
    return <Navigate to={`/${DefaultUrls.auth}`} replace />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.summary}>
        <AvatarUpload user={user} />
        <div className={styles.info}>
          <h1>{user.fullName}</h1>
          <p>@{user.login}</p>
          {user.email && <p>{user.email}</p>}
          <p className={styles.muted}>
            С нами с {new Date(user.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>
      </div>

      <div className={styles.forms}>
        <ProfileInfoForm user={user} />
        <ChangePasswordForm />
      </div>
    </section>
  );
};
