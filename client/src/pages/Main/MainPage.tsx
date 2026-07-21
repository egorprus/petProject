import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@app/store";
import { PostsList } from "@shared/ui/Posts/PostsList";
import { startFetchPosts } from "@features/posts/postSlice";
import { PostActionAdd } from "@features/posts/PostActionAdd";
import { Spinner } from "@shared/ui/Spinner/Spinner";
import styles from "./style.module.scss";

export const MainPage = () => {
  const dispatch = useAppDispatch();
  const { data } = useSelector((state: RootState) => state.user);
  const { posts } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(startFetchPosts());
  }, []);

  if (!data) {
    return <Spinner />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Notes</h1>
        <PostActionAdd />
      </div>
      <PostsList posts={posts.items} />
    </section>
  );
};
