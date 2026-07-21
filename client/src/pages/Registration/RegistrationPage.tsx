import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { AuthForm } from "@shared/ui/AuthForm/AuthForm";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { minLength, required } from "@shared/utils/validate";
import { ButtonTypes, DefaultUrls, RequiredFields } from "@shared/types/enums";
import { useAppDispatch } from "@app/store";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { startRegistration } from "@features/auth/authSlice";
import { RegistrationData } from "@shared/types/types";

export const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>();

  const onSubmit: SubmitHandler<RegistrationData> = (data: RegistrationData) => {
    dispatch(startRegistration(data));
  };

  if (isAuthenticated) {
    return <Navigate to={`/${DefaultUrls.main}`} replace />;
  }

	return (
    <AuthForm
      onSubmit={handleSubmit(onSubmit)}
      title="Регистрация"
      footer={
        <>
          Уже есть аккаунт? <Link to="/auth">Войти</Link>
        </>
      }
    >
      <FieldWrapper name={FIELDS.login.name} label={FIELDS.login.label} errors={errors.login}>
        <InputText
          register={register(RequiredFields.login, {
            validate: { ...FIELDS.login.validate },
          })}
        />
      </FieldWrapper>
      <FieldWrapper name={FIELDS.fullName.name} label={FIELDS.fullName.label} errors={errors.fullName}>
        <InputText
          register={register(RequiredFields.fullName, {
            validate: { ...FIELDS.fullName.validate },
          })}
        />
      </FieldWrapper>
      <FieldWrapper name={FIELDS.password.name} label={FIELDS.password.label} errors={errors.password}>
        <InputText
          register={register(RequiredFields.password, {
            validate: { ...FIELDS.password.validate },
          })}
        />
      </FieldWrapper>
      <DefaultButton {...FIELDS.signIn} type={ButtonTypes.submit} />
    </AuthForm>
  );
};

const FIELDS = {
  login: {
    name: RequiredFields.login,
    label: "Login",
    validate: {
      min: minLength(3),
      required: required,
    },
  },
  password: {
    name: RequiredFields.password,
    label: "Password",
    validate: {
      min: minLength(8),
      required: required,
    },
  },
  fullName: {
    name: RequiredFields.fullName,
    label: "Full name",
    validate: {
      min: minLength(3),
      required: required,
    },
  },
  signIn: {
    label: "Sign up",
    type: ButtonTypes.submit,
  },
};
