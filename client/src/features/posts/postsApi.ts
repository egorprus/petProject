import { baseApi } from "@shared/api/baseApi";
import { PostItem } from "@shared/types/types";

// Comment mutations return the updated post — put it into the topic cache instead of refetching
const putPostIntoCache = async (
  { id }: { id: string },
  {
    dispatch,
    queryFulfilled,
  }: { dispatch: (action: unknown) => unknown; queryFulfilled: Promise<{ data: PostItem }> },
) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(postsApi.util.upsertQueryData("getPost", id, data));
  } catch {
    // error is surfaced by the mutation itself
  }
};

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
    getPost: b.query<PostItem, string>({
      query: (id) => ({ url: `/posts/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Post", id }],
    }),
    createPost: b.mutation<PostItem, { title: string; text: string }>({
      query: (data) => ({ url: "/posts", method: "POST", data }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: b.mutation<void, { id: string; title: string; text: string }>(
      {
        query: ({ id, ...data }) => ({
          url: `/posts/${id}`,
          method: "PATCH",
          data,
        }),
        invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
      },
    ),
    deletePost: b.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      // Only the list: invalidating the topic itself would refetch a deleted post
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    addComment: b.mutation<PostItem, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/posts/${id}/comments`,
        method: "POST",
        data: { text },
      }),
      onQueryStarted: putPostIntoCache,
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updateComment: b.mutation<
      PostItem,
      { id: string; commentId: string; text: string }
    >({
      query: ({ id, commentId, text }) => ({
        url: `/posts/${id}/comments/${commentId}`,
        method: "PATCH",
        data: { text },
      }),
      onQueryStarted: putPostIntoCache,
    }),
    deleteComment: b.mutation<PostItem, { id: string; commentId: string }>({
      query: ({ id, commentId }) => ({
        url: `/posts/${id}/comments/${commentId}`,
        method: "DELETE",
      }),
      onQueryStarted: putPostIntoCache,
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = postsApi;
