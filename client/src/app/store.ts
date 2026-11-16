import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { userReducer } from "@features/auth/authSlice";
import { baseApi } from "@shared/api/baseApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
