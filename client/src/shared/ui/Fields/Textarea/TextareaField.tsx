import { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./style.scss";

interface Props {
  register: UseFormRegisterReturn<string>;
  inputProcessing?: any;
  autoFocus?: boolean;
}

export const TextareaField = ({ register, inputProcessing, autoFocus }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let validationValue = e.target.value;
    if (inputProcessing) {
      validationValue = inputProcessing(validationValue);
      e = {
        ...e,
        target: { ...e.target, value: validationValue },
      } as ChangeEvent<HTMLTextAreaElement>;
    }
    register.onChange(e);
  };

  return (
    <textarea
      className="field__textarea"
      {...register}
      onChange={handleChange}
      autoFocus={autoFocus}
    />
  );
};
