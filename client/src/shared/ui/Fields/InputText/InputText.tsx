import { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./style.scss";

interface Props {
  register: UseFormRegisterReturn<string>;
  inputProcessing?: any;
  autoFocus?: boolean;
  type?: "text" | "password" | "email";
}
export const InputText = ({ register, inputProcessing, autoFocus, type = "text" }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let validationValue = e.target.value;
    if (inputProcessing) {
      validationValue = inputProcessing(validationValue);
      e = {
        ...e,
        target: { ...e.target, value: validationValue },
      } as ChangeEvent<HTMLInputElement>;
    }
    register.onChange(e);
  };

  return (
    <input
      className="field__input"
      {...register}
      type={type}
      onChange={handleChange}
      autoFocus={autoFocus}
    />
  );
};
