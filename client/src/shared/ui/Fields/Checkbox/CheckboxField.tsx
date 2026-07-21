import { UseFormRegisterReturn } from "react-hook-form";
import "./style.scss";

interface Props {
  label: string;
  register: UseFormRegisterReturn<string>;
}

export const CheckboxField = ({ label, register }: Props) => (
  <label className="field__checkbox-label">
    <input type="checkbox" className="field__checkbox" {...register} />
    {label}
  </label>
);
