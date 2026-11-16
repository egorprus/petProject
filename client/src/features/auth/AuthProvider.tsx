import { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "./authSlice";
import { AuthProviderValue } from "@shared/types/types";
import { DefaultUrls } from "@shared/types/enums";
import { RootState, useAppDispatch } from "@app/store";
import { authApi } from "./authApi";
import { baseApi } from "@shared/api/baseApi";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useSelector((state: RootState) => state.user);

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    dispatch(authApi.endpoints.getMe.initiate());
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    navigate(`/${DefaultUrls.auth}`);
  };

  const value: AuthProviderValue = {
    token: data?.token || "",
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
