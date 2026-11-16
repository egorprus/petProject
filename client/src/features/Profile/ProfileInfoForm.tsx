import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@app/store";
import { updateUser } from "@features/auth/authSlice";
import { ButtonTypes, RequiredFields } from "@shared/types/enums";
import { ProfileFormData, UserData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { email, minLength, required } from "@shared/utils/validate";
import { getErrorMessage, profileApi } from "./api";
import styles from "./style.module.scss";

interface Props {
  user: UserData;
}

export const ProfileInfoForm = ({ user }: Props) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: { fullName: user.fullName, email: user.email || "" },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setError("");
    setSaved(false);
    try {
      const updated = await profileApi.updateMe({ ...data, email: data.email.trim() });
      dispatch(updateUser(updated));
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.formTitle}>Личные данные</h2>
      <FieldWrapper name={FIELDS.fullName.name} label={FIELDS.fullName.label} errors={errors.fullName}>
        <InputText register={register(RequiredFields.fullName, { validate: FIELDS.fullName.validate })} />
      </FieldWrapper>
      <FieldWrapper name={FIELDS.email.name} label={FIELDS.email.label} errors={errors.email}>
        <InputText type="email" register={register(RequiredFields.email, { validate: FIELDS.email.validate })} />
      </FieldWrapper>
      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.success}>Сохранено</p>}
      <DefaultButton type={ButtonTypes.submit} label="Сохранить" disabled={isSubmitting} />
    </form>
  );
};

const FIELDS = {
  fullName: {
    name: RequiredFields.fullName,
    label: "Full name",
    validate: {
      min: minLength(3),
      required: required,
    },
  },
  email: {
    name: RequiredFields.email,
    label: "Email",
    validate: {
      email: email,
    },
  },
};
