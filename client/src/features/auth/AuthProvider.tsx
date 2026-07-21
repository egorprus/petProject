import { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, startAuth } from "./authSlice";
import { AuthProviderValue } from "@shared/types/types";
import { DefaultUrls } from "@shared/types/enums";
import { RootState } from "@app/store";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.user);

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    dispatch(startAuth(""));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/${DefaultUrls.auth}`);
  };

  const value: AuthProviderValue = {
    token: data?.token || "",
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
