import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ButtonTypes, RequiredFields } from "@shared/types/enums";
import { ChangePasswordData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { minLength, required } from "@shared/utils/validate";
import { getErrorMessage, profileApi } from "./api";
import styles from "./style.module.scss";

export const ChangePasswordForm = () => {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>();

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    setError("");
    setSaved(false);
    try {
      await profileApi.changePassword(data);
      reset();
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.formTitle}>Смена пароля</h2>
      <FieldWrapper
        name={FIELDS.currentPassword.name}
        label={FIELDS.currentPassword.label}
        errors={errors.currentPassword}
      >
        <InputText
          type="password"
          register={register(RequiredFields.currentPassword, { validate: FIELDS.currentPassword.validate })}
        />
      </FieldWrapper>
      <FieldWrapper name={FIELDS.newPassword.name} label={FIELDS.newPassword.label} errors={errors.newPassword}>
        <InputText
          type="password"
          register={register(RequiredFields.newPassword, { validate: FIELDS.newPassword.validate })}
        />
      </FieldWrapper>
      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.success}>Пароль изменён</p>}
      <DefaultButton type={ButtonTypes.submit} label="Сменить пароль" disabled={isSubmitting} />
    </form>
  );
};

const FIELDS = {
  currentPassword: {
    name: RequiredFields.currentPassword,
    label: "Current password",
    validate: {
      required: required,
    },
  },
  newPassword: {
    name: RequiredFields.newPassword,
    label: "New password",
    validate: {
      min: minLength(5),
      required: required,
    },
  },
};
