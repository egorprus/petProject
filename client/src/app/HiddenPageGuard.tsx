import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@app/store";
import { DefaultUrls } from "@shared/types/enums";

interface Props {
  page: DefaultUrls;
  children: ReactNode;
}

// Pages hidden in profile settings are closed by direct URL too — redirect to the profile
export const HiddenPageGuard = ({ page, children }: Props) => {
  const hiddenPage = useSelector((state: RootState) => state.user.data?.hiddenPage);

  if (hiddenPage?.includes(page)) {
    return <Navigate to={`/${DefaultUrls.profile}`} replace />;
  }

  return <>{children}</>;
};
