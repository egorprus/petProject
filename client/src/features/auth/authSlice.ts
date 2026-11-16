import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { UserStatus } from "@shared/types/enums";
import { UserData } from "@shared/types/types";
import { authApi } from "./authApi";

interface InitType {
  data: UserData | null;
  status: UserStatus;
  isAuthenticated: boolean;
}

const initialState: InitType = {
  data: null,
  status: localStorage.getItem("token")
    ? UserStatus.loading
    : UserStatus.notAuth,
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
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    const { login, register, getMe } = authApi.endpoints;
    builder
      .addMatcher(
        isAnyOf(login.matchPending, register.matchPending, getMe.matchPending),
        (s) => {
          s.status = UserStatus.loading;
        },
      )
      .addMatcher(
        isAnyOf(
          login.matchFulfilled,
          register.matchFulfilled,
          getMe.matchFulfilled,
        ),
        (s, { payload }) => {
          s.data = payload;
          s.status = UserStatus.success;
          s.isAuthenticated = true;
        },
      )
      .addMatcher(
        isAnyOf(
          login.matchRejected,
          register.matchRejected,
          getMe.matchRejected,
        ),
        (s) => {
          s.data = null;
          s.status = UserStatus.notAuth;
          s.isAuthenticated = false;
        },
      );
  },
});

export const userReducer = userSlice.reducer;

export const { logout, updateUser } = userSlice.actions;
