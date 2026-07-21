import { ReactNode, useState } from "react";

interface Props {
  title: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  titleClassName?: string;
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const Collapsible = ({
  title,
  as: Tag = "div",
  titleClassName,
  className,
  defaultOpen = true,
  children,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <Tag className={titleClassName} style={{ cursor: "pointer" }} onClick={() => setOpen((v) => !v)}>
        {open ? "▾" : "▸"} {title}
      </Tag>
      {open && children}
    </div>
  );
};
