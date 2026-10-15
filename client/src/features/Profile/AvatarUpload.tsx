import { ChangeEvent, useRef, useState } from "react";
import { useAppDispatch } from "@app/store";
import { updateUser } from "@features/auth/authSlice";
import { ButtonTypes } from "@shared/types/enums";
import { UserData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { UserAvatar } from "@shared/ui/UserAvatar/UserAvatar";
import { getErrorMessage, profileApi } from "./api";
import styles from "./style.module.scss";

const MAX_SIZE = 1024 * 1024;

interface Props {
  user: UserData;
}

export const AvatarUpload = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setError("Файл больше 1 МБ");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const updated = await profileApi.uploadAvatar(file);
      dispatch(updateUser(updated));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.avatarBlock}>
      <UserAvatar login={user.login} avatarUrl={user.avatarUrl} className={styles.avatarLarge} />
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleChange}
      />
      <DefaultButton
        type={ButtonTypes.button}
        label={isLoading ? "Загрузка..." : "Сменить аватар"}
        handleClick={() => inputRef.current?.click()}
        disabled={isLoading}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
