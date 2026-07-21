import { FC } from "react";
import style from "./style.module.scss";

export const Spinner: FC = () => {
  return (
    <div className={style.spinner}>
      <span>Loading....</span>
    </div>
  );
};
