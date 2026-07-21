import { createSlice } from "@reduxjs/toolkit";
import { FetchStatus } from "@shared/types/enums";
import { PostItem } from "@shared/types/types";

interface InitState {
  posts: {
    items: PostItem[];
    status: string;
  };
  tags: {
    items: any[];
    status: string;
  };
}
const initialState: InitState = {
  posts: {
    items: [],
    status: FetchStatus.init,
  },
  tags: {
    items: [],
    status: FetchStatus.init,
  },
};

const postsStore = createSlice({
  name: "posts",
  initialState,
  reducers: {
		startFetchPosts: (state) => {
			state.posts.status = FetchStatus.loading;
		},
		succesFetchPosts: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = FetchStatus.success;
		},
		addPost: (state, action) => {
			state.posts.items.unshift(action.payload);
		},
		updatePost: (state, action) => {
			const index = state.posts.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.posts.items[index] = action.payload;
			}
		},
		removePost: (state, action) => {
			state.posts.items = state.posts.items.filter((item) => item._id !== action.payload);
		}
	}
});

export const postReducer = postsStore.reducer;

export const { startFetchPosts, succesFetchPosts, addPost, updatePost, removePost } = postsStore.actions;
