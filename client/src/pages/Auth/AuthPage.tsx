import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { minLength, required } from "@shared/utils/validate";
import { AuthForm } from "@shared/ui/AuthForm/AuthForm";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { ButtonTypes, DefaultUrls, RequiredFields, UserStatus } from "@shared/types/enums";
import { LoginData } from "@shared/types/types";
import { useDispatch, useSelector } from "react-redux";
import { startAuth } from "@features/auth/authSlice";
import { RootState } from "@app/store";

export const AuthPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const status = useSelector((state: RootState) => state.user.status);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = (credential: LoginData) => {
    dispatch(startAuth(credential));
  };

  if (isAuthenticated) {
    return <Navigate to={`/${DefaultUrls.main}`} replace />;
  }

	return (
    <AuthForm
      onSubmit={handleSubmit(onSubmit)}
      title="Авторизация"
      footer={
        <>
          Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
        </>
      }
    >
      <FieldWrapper name={FIELDS.login.name} label={FIELDS.login.label} errors={errors.login}>
        <InputText
          autoFocus={true}
          register={register(RequiredFields.login, {
            validate: { ...FIELDS.login.validate },
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
      <DefaultButton {...FIELDS.signIn} disabled={status === UserStatus.loading} />
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
      min: minLength(3),
      required: required,
    },
  },
  signIn: {
    label: "Sign in",
    type: ButtonTypes.submit,
  },
};
