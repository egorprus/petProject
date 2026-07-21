import { UseFormRegisterReturn } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";

interface DatePickerProps {
  onChange?: (date: Date | null) => void;
  selected?: Date | null;
  register: UseFormRegisterReturn<string>;
}

export const DatePickerField = ({
  onChange,
  selected,
  register,
}: DatePickerProps) => {
  const { ref: _, onChange: __, ...rest } = register;

  return (
    <DatePicker
      {...rest}
      selected={selected}
      onChange={(date: Date | null) => onChange?.(date)}
      autoComplete="off"
    />
  );
};
