import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@app/store";
import { updateUser } from "@features/auth/authSlice";
import { ButtonTypes } from "@shared/types/enums";
import { PageItem, UserData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { CheckboxField } from "@shared/ui/Fields/Checkbox/CheckboxField";
import { getErrorMessage, profileApi } from "./api";
import styles from "./style.module.scss";

interface Props {
  user: UserData;
}

// page key -> checked (shown in nav)
type PagesFormData = Record<string, boolean>;

export const PagesSettings = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, dirtyFields },
  } = useForm<PagesFormData>();

  useEffect(() => {
    profileApi
      .getPages()
      .then((list) => {
        setPages(list);
        reset(Object.fromEntries(list.map(({ key }) => [key, !user.hiddenPage?.includes(key)])));
      })
      .catch((err) => setError(getErrorMessage(err)));
    // Load once; after saving the form already holds the actual values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<PagesFormData> = async (data) => {
    setError("");
    setSaved(false);
    try {
      const hiddenPage = pages.filter(({ key }) => !data[key]).map(({ key }) => key);
      const updated = await profileApi.updateHiddenPages(hiddenPage);
      dispatch(updateUser(updated));
      // Saved values become the new baseline, so the "changed" marks disappear
      reset(data);
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.formTitle}>Страницы в меню</h2>
      <div className={styles.checkboxList}>
        {pages.map(({ key, name }) => (
          <div key={key} className={dirtyFields[key] ? styles.changed : undefined}>
            <CheckboxField label={name} register={register(key)} />
          </div>
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {isDirty && <p className={styles.unsaved}>Есть несохранённые изменения</p>}
      {saved && !isDirty && <p className={styles.success}>Настройки сохранены</p>}
      <DefaultButton
        type={ButtonTypes.submit}
        label="Сохранить"
        disabled={isSubmitting || !isDirty}
      />
    </form>
  );
};
