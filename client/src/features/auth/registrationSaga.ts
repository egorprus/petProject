import { PayloadAction } from "@reduxjs/toolkit";
import { RegistrationData } from "@shared/types/types";
import { call, put } from "redux-saga/effects";
import { failedAuth, successAuth } from "./authSlice";
import axios from "@shared/api/axios";

export function* registrationSaga(action: PayloadAction<RegistrationData>) {
  try {
    const { data } = yield call(axios.post, "/register", action.payload);
    yield put(successAuth(data));
  } catch {
    yield put(failedAuth());
  }
}
