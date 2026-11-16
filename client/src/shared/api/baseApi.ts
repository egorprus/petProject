import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios from "./axios";
import { AxiosError, AxiosRequestConfig } from "axios";

type Args = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
};

const axiosBaseQuery =
  (): BaseQueryFn<Args, unknown, { status?: number; data: unknown }> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axios({ url, method, data, params });
      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Post", "Me"],
  endpoints: () => ({}),
});
