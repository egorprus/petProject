import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';
import Select, { Options, StylesConfig } from 'react-select';

interface SelectProps<T> {
  options: Options<T>;
  onChange?: (option: T | null) => void;
  register: UseFormRegisterReturn<string>;
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const selectStyles: StylesConfig<any, false> = {
  container: (base) => ({ ...base, width: "100%" }),
  control: (base, state) => ({
    ...base,
    width: "100%",
    boxSizing: "border-box",
    minHeight: "unset",
    padding: "2px 4px",
    borderRadius: 8,
    borderColor: state.isFocused ? "#28ce97" : "#ddd",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(40, 206, 151, 0.15)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#28ce97" : "#ddd",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "6px 8px" }),
  singleValue: (base) => ({ ...base, color: "#111" }),
  placeholder: (base) => ({ ...base, color: "#999" }),
  input: (base) => ({ ...base, color: "#111" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#999" }),
  menu: (base) => ({
    ...base,
    border: "1px solid #ebebeb",
    borderRadius: 10,
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#28ce97" : state.isFocused ? "#f0fdf8" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
    "&:active": {
      backgroundColor: "#28ce97",
      color: "#fff",
    },
  }),
};

export const SelectField = <T extends { value: unknown; label: string, }>({
  options,
  onChange,
  register,
  errors
}: SelectProps<T>) => {
  const { ref: _, onChange: __, ...rest } = register;

  return (
    <Select
      {...rest}
      options={options}
      onChange={onChange}
      styles={selectStyles}
    />
  );
};
