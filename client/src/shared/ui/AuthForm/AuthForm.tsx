import { ReactNode } from "react";
import "./style.scss";

interface Props {
	onSubmit: any,
	children: ReactNode,
	title: string,
	footer?: ReactNode,
}
export const AuthForm = ({ onSubmit, children, title, footer }: Props) => {
  return (
    <section className="auth-form">
      <div className="auth-form-body">
        <h2 className="auth-form__title">{title}</h2>
        <form className="auth-form__form" onSubmit={onSubmit}>{children}</form>
        {footer && <p className="auth-form__footer">{footer}</p>}
      </div>
    </section>
  );
};
