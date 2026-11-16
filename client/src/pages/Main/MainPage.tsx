import { PostsList } from "@shared/ui/Posts/PostsList";
import { PostActionAdd } from "@features/posts/PostActionAdd";
import { Spinner } from "@shared/ui/Spinner/Spinner";
import styles from "./style.module.scss";
import { useGetPostsQuery } from "@features/posts/postsApi";

export const MainPage = () => {
  const { data: posts = [], isLoading } = useGetPostsQuery();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Notes</h1>
        <PostActionAdd />
      </div>
      <PostsList posts={posts} />
    </section>
  );
};
