# План: замена redux-saga на RTK Query

Этапы идут по порядку. После каждого этапа приложение должно собираться и работать.
Саги и RTK Query могут работать одновременно, поэтому их убираем по одной, а не все сразу.

## Что есть сейчас

| Сага | Экшен-триггер | Что делает | Кто вызывает |
|---|---|---|---|
| `fetchPostsSaga` | `posts/startFetchPosts` | `GET /posts` → `succesFetchPosts` | `MainPage` |
| `authSaga` (с payload) | `auth/startAuth` | `POST /login` → `successAuth` / `failedAuth` | `AuthPage` |
| `authSaga` (без payload) | `auth/startAuth("")` | `GET /auth/me` → `successAuth` / `failedAuth` | `App`, `AuthProvider.handleLogin` |
| `registrationSaga` | `auth/startRegistration` | `POST /register` → `successAuth` / `failedAuth` | `RegistrationPage` |

Остальные мутации постов (`create`, `update`, `remove`, `addComment`) уже вызываются напрямую
через `features/posts/api.ts`. Результат вручную кладётся в `postSlice` (`addPost`, `updatePost`,
`removePost`). То же с профилем: `profileApi.*` + `dispatch(updateUser(...))`.

## 1. Инфраструктура: базовый API и store

**`src/shared/api/baseApi.ts`** — один `createApi` на всё приложение. Эндпоинты фич
подключаются к нему через `injectEndpoints`.

Используем свой `axiosBaseQuery` вместо `fetchBaseQuery`. Тогда остаются общий `baseURL`,
интерцептор с токеном из `shared/api/axios.ts` и привычный формат ошибок для `getErrorMessage`.

```ts
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosRequestConfig } from "axios";
import axios from "./axios";

type Args = { url: string; method?: AxiosRequestConfig["method"]; data?: unknown; params?: unknown };

const axiosBaseQuery = (): BaseQueryFn<Args, unknown, { status?: number; data: unknown }> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axios({ url, method, data, params });
      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data ?? err.message } };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Post", "Me"],
  endpoints: () => ({}),
});
```

**`src/app/store.ts`:**

- добавить `[baseApi.reducerPath]: baseApi.reducer` и `.concat(baseApi.middleware)`;
- **убрать `thunk: false`**: RTK Query работает через thunk, без него `initiate` и хуки не заработают;
- `sagaMiddleware` пока оставить;
- по желанию: `setupListeners(store.dispatch)` для `refetchOnFocus` / `refetchOnReconnect`.

Проверка: `npx tsc --noEmit` и `npm run dev`. Всё работает как раньше.

## 2. Посты

**`src/features/posts/postsApi.ts`** (заменяет `api.ts` и `fetchPostsSaga.ts`):

```ts
export const postsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPosts: b.query<PostItem[], void>({
      query: () => ({ url: "/posts" }),
      providesTags: (res) =>
        res ? [...res.map(({ _id }) => ({ type: "Post" as const, id: _id })), { type: "Post", id: "LIST" }]
            : [{ type: "Post", id: "LIST" }],
    }),
    createPost: b.mutation<PostItem, { title: string; text: string }>({
      query: (data) => ({ url: "/posts", method: "POST", data }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: b.mutation<void, { id: string; title: string; text: string; status?: boolean }>({
      query: ({ id, ...data }) => ({ url: `/posts/${id}`, method: "PATCH", data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
    }),
    deletePost: b.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Post", id }],
    }),
    addComment: b.mutation<PostItem, { id: string; text: string }>({
      query: ({ id, text }) => ({ url: `/posts/${id}/comments`, method: "POST", data: { text } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostsQuery, useCreatePostMutation, useUpdatePostMutation,
  useDeletePostMutation, useAddCommentMutation,
} = postsApi;
```

Компоненты:

- **`MainPage`**: убрать `useEffect` + `dispatch(startFetchPosts())` + `useSelector(state.post)`,
  взамен `const { data: posts = [], isLoading } = useGetPostsQuery()`.
- **`PostActionAdd`**: `useCreatePostMutation` / `useUpdatePostMutation`, вызывать
  `await createPost(data).unwrap()`. `dispatch(addPost/updatePost)` больше не нужен.
- **`Post`** (`shared/ui/Posts`): `useUpdatePostMutation` для чекбокса и `useDeletePostMutation`.
- **`PostComments`**: `useAddCommentMutation`, а локальный `isSubmitting` заменить на `isLoading` из хука.

Сейчас любая мутация перезапрашивает весь список. Для постов этого хватает. Если позже нужен
мгновенный отклик (например, на чекбокс `status`), добавить optimistic update в `updatePost`:

```ts
async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
  const undo = dispatch(postsApi.util.updateQueryData("getPosts", undefined, (draft) => {
    const p = draft.find((x) => x._id === id);
    if (p) Object.assign(p, patch);
  }));
  try { await queryFulfilled; } catch { undo.undo(); }
}
```

После этого удалить: `fetchPostsSaga.ts`, `api.ts`, `postSlice.ts` (поле `tags` в нём не используется),
`post: postReducer` из store и строку `posts/startFetchPosts` из `rootSaga`.

Проверка: список загружается; создание, редактирование, удаление, чекбокс и комментарий
обновляют список без перезагрузки страницы.

## 3. Авторизация

Состояние пользователя (`state.user`) читают 8+ мест: `App`, `Header`, `Profile`,
`HiddenPageGuard`, `MainPage`, `ProfilePage`, `AuthPage`, `RegistrationPage`.
Поэтому **`authSlice` оставляем**, но наполнять его будут не саги, а `extraReducers`
по матчерам RTK Query. Компоненты, которые только читают `state.user`, менять не придётся.

**`src/features/auth/authApi.ts`:**

```ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<UserData, LoginData>({ query: (data) => ({ url: "/login", method: "POST", data }) }),
    register: b.mutation<UserData, RegistrationData>({ query: (data) => ({ url: "/register", method: "POST", data }) }),
    getMe: b.query<UserData, void>({ query: () => ({ url: "/auth/me" }), providesTags: ["Me"] }),
  }),
});
```

**`authSlice`:**

- удалить `startAuth`, `startRegistration`, `successAuth`, `failedAuth` (а с ними и `PayloadAction<LoginData | string>`);
- оставить `logout` и `updateUser`;
- добавить `extraReducers`:

```ts
extraReducers: (builder) => {
  const { login, register, getMe } = authApi.endpoints;
  builder
    .addMatcher(isAnyOf(login.matchPending, register.matchPending, getMe.matchPending),
      (s) => { s.status = UserStatus.loading; })
    .addMatcher(isAnyOf(login.matchFulfilled, register.matchFulfilled, getMe.matchFulfilled),
      (s, { payload }) => { s.data = payload; s.status = UserStatus.success; s.isAuthenticated = true; })
    .addMatcher(isAnyOf(login.matchRejected, register.matchRejected, getMe.matchRejected),
      (s) => { s.data = null; s.status = UserStatus.notAuth; s.isAuthenticated = false; });
}
```

**Работа с токеном в `localStorage`.** Сейчас запись идёт внутри reducer `successAuth`, а удаление
внутри саги. Reducer должен быть чистой функцией, поэтому переносим это в `onQueryStarted` эндпоинтов:

```ts
async onQueryStarted(_, { queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;
    if (data.token) localStorage.setItem("token", data.token);
  } catch {
    localStorage.removeItem("token");
  }
}
```

(для `login` и `register`; для `getMe` достаточно ветки `catch`).

Компоненты:

- **`App`**: вместо `useEffect` + `dispatch(startAuth(""))` вызвать
  `useGetMeQuery(undefined, { skip: !localStorage.getItem("token") })`. Спиннер по `state.user.status` остаётся.
- **`AuthPage`**: `const [login, { isLoading }] = useLoginMutation()`, в `onSubmit` вызвать `login(credential)`.
  Редирект по `isAuthenticated` остаётся.
- **`RegistrationPage`**: то же самое с `useRegisterMutation`.
- **`AuthProvider.handleLogin`**: вместо `dispatch(startAuth(""))` вызвать
  `dispatch(authApi.endpoints.getMe.initiate())` (или `refetch` из хука).
- **`AuthProvider.handleLogout`**: кроме `dispatch(logout())` добавить
  **`dispatch(baseApi.util.resetApiState())`**. Без этого в кэше останутся посты и `getMe`
  предыдущего пользователя, и следующий пользователь их увидит.

После этого удалить: `authSaga.ts`, `registrationSaga.ts`, `rootSaga.ts`, `sagaMiddleware` из store.

Проверка:

- вход с неверным паролем: кнопка снова активна, токена в `localStorage` нет;
- успешный вход: редирект на `/content`;
- F5 с валидным токеном: спиннер, затем страница;
- F5 с протухшим токеном: экран входа, токен удалён;
- регистрация;
- выход, затем вход другим пользователем: посты прошлого пользователя не мелькают.

## 4. Профиль (по желанию)

Сейчас это работает через `profileApi` + `dispatch(updateUser(...))`. Сага тут не используется, поэтому этап необязательный.
Если переводить, то так:

- эндпоинты `updateMe`, `updateHiddenPages`, `uploadAvatar`, `changePassword`, `getPages` в `authApi`
  (или в `features/Profile/profileApi.ts` через `injectEndpoints`);
- в `authSlice` добавить матчер `isAnyOf(updateMe.matchFulfilled, updateHiddenPages.matchFulfilled, uploadAvatar.matchFulfilled)`,
  который обновляет `state.data`. Тогда `dispatch(updateUser)` в `ProfileInfoForm`, `PagesSettings` и `AvatarUpload` можно убрать;
- `getErrorMessage` принимает `AxiosError`. Для ошибок из `.unwrap()` (`{ status, data }`) его нужно
  дописать, а логику разбора `data` (массив express-validator или `{ message }`) оставить прежней;
- `uploadAvatar`: в `data` передаётся `FormData`, axios сам выставит заголовки.

## 5. Уборка

- `npm uninstall redux-saga`;
- проверить, что нигде не осталось импортов `redux-saga`, `startAuth`, `startFetchPosts`,
  `startRegistration` (`grep -r`);
- `npx tsc --noEmit` проходит (в `tsconfig` включён `noUnusedLocals`, он подсветит забытые импорты);
- `npm run build`.

## 6. Дальше (необязательно)

Movies, Bank и Calendar сейчас держат данные в `useState` внутри хуков `use*Data`, саги там нет.
Их можно перевести на тот же `baseApi` тем же способом, что и посты: `getAll` как query с тегами,
мутации с `invalidatesTags`. Это уберёт ручные `setMovies(prev => ...)`.
Публичный `getShared(token)` тоже отлично подходит как query.
