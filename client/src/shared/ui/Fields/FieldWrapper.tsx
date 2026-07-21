import { RequiredFields } from "@shared/types/enums";
import { ReactNode } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface Props {
  name: RequiredFields,
  label: string,
  children: ReactNode,
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

export const FieldWrapper = ({name, label, children, errors}: Props) => {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div className="field__input-wrapper">
        {children}
      </div>
      {errors && (
        <div className="field__error">
          {errors.type === "currentLength" && (
            <p>current lenght</p>
          )}
          {errors.type === "min" && <p>minimum</p>}
          {errors.type === "required" && <p>obyazatelno</p>}
        </div>
      )}
    </div>
  )
};