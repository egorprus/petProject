import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { RootState } from "@app/store";
import { DefaultUrls } from "@shared/types/enums";
import { Spinner } from "@shared/ui/Spinner/Spinner";
import { PostComments } from "@shared/ui/Posts/PostComments";
import { formatPostDate } from "@shared/ui/Posts/PostCard";
import { PostActionAdd } from "@features/posts/PostActionAdd";
import {
  useDeletePostMutation,
  useGetPostQuery,
} from "@features/posts/postsApi";
import styles from "../Main/style.module.scss";

export const TopicPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.data?._id);
  const { data: post, isLoading, isError } = useGetPostQuery(id);
  const [deletePost] = useDeletePostMutation();

  const backLink = (
    <Link to={`/${DefaultUrls.main}`} className="post__back">
      ← Назад к Content
    </Link>
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !post) {
    return (
      <section className={styles.page}>
        {backLink}
        <p>Тема не найдена</p>
      </section>
    );
  }

  const isAuthor = !!userId && post.user?._id === userId;

  const handleDelete = async () => {
    await deletePost(post._id).unwrap();
    navigate(`/${DefaultUrls.main}`);
  };

  return (
    <section className={styles.page}>
      {backLink}
      <article className="post">
        <div className="post-header">
          <h1 className="post__item-title post__item-title--large">
            {post.title}
          </h1>
          {isAuthor && (
            <div className="post__actions">
              <PostActionAdd post={post} />
              <button className="post__icon-btn" onClick={handleDelete}>
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="post__meta">
          <span>{post.user?.fullName ?? post.user?.login}</span>
          <span>{formatPostDate(post.createdAt)}</span>
        </div>
        <p className="post__item-text post__item-text--full">{post.text}</p>
        <PostComments post={post} />
      </article>
    </section>
  );
};
