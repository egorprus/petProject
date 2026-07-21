interface ErrorAuthProp {
  text: string;
}

export const ErrorAuth = ({ text }: ErrorAuthProp) => {
  return <p className="">{text}</p>;
};
