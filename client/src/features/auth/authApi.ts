import { baseApi } from "@shared/api/baseApi";
import { LoginData, RegistrationData, UserData } from "@shared/types/types";

const saveToken = async (
  _arg: unknown,
  { queryFulfilled }: { queryFulfilled: Promise<{ data: UserData }> },
) => {
  try {
    const { data } = await queryFulfilled;
    if (data.token) localStorage.setItem("token", data.token);
  } catch {
    localStorage.removeItem("token");
  }
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<UserData, LoginData>({
      query: (data) => ({ url: "/login", method: "POST", data }),
      onQueryStarted: saveToken,
    }),
    register: b.mutation<UserData, RegistrationData>({
      query: (data) => ({ url: "/register", method: "POST", data }),
      onQueryStarted: saveToken,
    }),
    getMe: b.query<UserData, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Me"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          localStorage.removeItem("token");
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
