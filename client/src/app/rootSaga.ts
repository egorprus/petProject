import { takeEvery } from "redux-saga/effects";
import { authSaga } from "@features/auth/authSaga";
import { registrationSaga } from "@features/auth/registrationSaga";
import { fetchPostSaga } from "@features/posts/fetchPostsSaga";

export function* rootWatcher() {
  yield takeEvery("auth/startAuth", authSaga);
  yield takeEvery("auth/startRegistration", registrationSaga);
  yield takeEvery("posts/startFetchPosts", fetchPostSaga);
}
