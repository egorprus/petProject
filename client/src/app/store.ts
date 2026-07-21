import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { postReducer } from "@features/posts/postSlice";
import { userReducer } from "@features/auth/authSlice";
import createSagaMiddleware from "redux-saga";
import { rootWatcher } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    post: postReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootWatcher);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
