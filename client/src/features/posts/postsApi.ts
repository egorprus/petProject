import { baseApi } from "@shared/api/baseApi";
import { PostItem } from "@shared/types/types";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPosts: b.query<PostItem[], void>({
      query: () => ({ url: "/posts" }),
      providesTags: (res) =>
        res
          ? [
              ...res.map(({ _id }) => ({ type: "Post" as const, id: _id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    createPost: b.mutation<PostItem, { title: string; text: string }>({
      query: (data) => ({ url: "/posts", method: "POST", data }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: b.mutation<
      void,
      { id: string; title: string; text: string; status?: boolean }
    >({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
    }),
    deletePost: b.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Post", id }],
    }),
    addComment: b.mutation<PostItem, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/posts/${id}/comments`,
        method: "POST",
        data: { text },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
} = postsApi;
