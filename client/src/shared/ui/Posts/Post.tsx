import { PostItem } from "@shared/types/types";
import { PostActionAdd } from "@features/posts/PostActionAdd";
import { PostComments } from "./PostComments";
import { FaTrash } from "react-icons/fa";
import {
  useDeletePostMutation,
  useUpdatePostMutation,
} from "@features/posts/postsApi";

interface Props {
  post: PostItem;
}
export const Post = ({ post }: Props) => {
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleToggleStatus = async () => {
    const status = !post.status;
    await updatePost({
      id: post._id,
      title: post.title,
      text: post.text,
      status,
    }).unwrap();
  };

  const handleDelete = async () => {
    await deletePost(post._id);
  };

  return (
    <>
      <div className={`post${post.status ? " post--done" : ""}`}>
        <div className="post-header">
          <label className="post__done-toggle">
            <input
              type="checkbox"
              checked={!!post.status}
              onChange={handleToggleStatus}
            />
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
        <PostComments post={post} />
      </div>
    </>
  );
};
