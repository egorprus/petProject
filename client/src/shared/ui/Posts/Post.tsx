import { PostItem } from "@shared/types/types";
import { useAppDispatch } from "@app/store";
import { removePost, updatePost } from "@features/posts/postSlice";
import { postsApi } from "@features/posts/api";
import { PostActionAdd } from "@features/posts/PostActionAdd";
import { FaTrash } from "react-icons/fa";

interface Props {
	post: PostItem;
}
export const Post = ({ post }: Props) => {
  const dispatch = useAppDispatch();

  const handleToggleStatus = async () => {
    const status = !post.status;
    await postsApi.update(post._id, { title: post.title, text: post.text, status });
    dispatch(updatePost({ ...post, status }));
  };

  const handleDelete = async () => {
    await postsApi.remove(post._id);
    dispatch(removePost(post._id));
  };

  return (
    <>
      <div className={`post${post.status ? " post--done" : ""}`}>
        <div className="post-header">
          <label className="post__done-toggle">
            <input type="checkbox" checked={!!post.status} onChange={handleToggleStatus} />
            <h2 className="post__item-title">{post.title}</h2>
          </label>
          <div className="post__actions">
            <PostActionAdd post={post} />
            <button className="post__icon-btn" onClick={handleDelete}>
              <FaTrash size={16} />
            </button>
          </div>
        </div>
        <p className="post__item-text">{post.text}</p>
      </div>
    </>
  );
};
