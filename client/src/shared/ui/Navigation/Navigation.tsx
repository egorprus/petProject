import { NavLink } from "react-router-dom";
import type { NavItem } from "@shared/types/types";

interface Props {
	navigationList: NavItem[]
}

export const Navigation = ({ navigationList }: Props) => {
  return (
    <nav className="nav">
      {navigationList.map(({ name, path }) => (
        <NavLink
          key={path}
          className={({ isActive }) =>
            `nav__link${isActive ? " nav__link--active" : ""}`
          }
          to={path}
        >
          {name}
        </NavLink>
      ))}
    </nav>
  );
};
