import { PayloadAction } from "@reduxjs/toolkit";
import { failedAuth, successAuth } from "./authSlice";
import { call, put } from "redux-saga/effects";
import axios from "@shared/api/axios";
import { LoginData } from "@shared/types/types";

export function* authSaga(action: PayloadAction<LoginData>) {
  try {
    if (action.payload) {
      const { data } = yield call(axios.post, "/login", action.payload);
      yield put(successAuth(data));
    } else {
      const { data } = yield call(axios.get, "/auth/me");
      yield put(successAuth(data));
    }
  } catch {
    localStorage.removeItem("token");
    yield put(failedAuth());
  }
}
