import { createContext } from "react";
import { AuthContextType } from "@shared/types/types";

export const AuthContext = createContext<AuthContextType>({token: '', onLogin: () => {}, onLogout: () => {}});
