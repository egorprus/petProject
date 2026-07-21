import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "@shared/types/types";

export const useAuth = () => useContext<AuthContextType>(AuthContext);
