import { ButtonTypes } from "@shared/types/enums";
import "./style.scss";

interface Props {
	type: ButtonTypes,
	label: string,
	handleClick?: () => void,
	classNames?: string,
	disabled?: boolean,
}

export const DefaultButton = ({ type, label, handleClick, classNames, disabled }: Props) => {
  return (
    <button
      className={`btn ${classNames || ""}`}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
