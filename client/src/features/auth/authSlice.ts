import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStatus } from "@shared/types/enums";
import { LoginData, RegistrationData, UserData } from "@shared/types/types";

interface InitType {
  data: UserData | null;
  status: UserStatus;
  isAuthenticated: boolean;
}

const initialState: InitType = {
  data: null,
  status: localStorage.getItem("token") ? UserStatus.loading : UserStatus.notAuth,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = UserStatus.notAuth;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    startAuth: (state, _action: PayloadAction<LoginData | string>) => {
      state.status = UserStatus.loading;
    },
    successAuth: (state, action) => {
      state.data = action.payload;
      state.status = UserStatus.success;
      state.isAuthenticated = true;
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    startRegistration: (state, _action: PayloadAction<RegistrationData>) => {
      state.status = UserStatus.loading;
    },
    failedAuth: (state) => {
      state.status = UserStatus.notAuth;
      state.data = null;
      state.isAuthenticated = false;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { logout, startAuth, successAuth, startRegistration, failedAuth } =
  userSlice.actions;
