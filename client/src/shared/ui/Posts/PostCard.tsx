import { Link } from "react-router-dom";
import { PostItem } from "@shared/types/types";
import { DefaultUrls } from "@shared/types/enums";
import { FaRegComment } from "react-icons/fa";

interface Props {
  post: PostItem;
}

export const formatPostDate = (date: string) =>
  new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const PostCard = ({ post }: Props) => {
  return (
    <Link to={`/${DefaultUrls.main}/${post._id}`} className="post post--card">
      <h2 className="post__item-title">{post.title}</h2>
      <p className="post__item-text post__item-text--preview">{post.text}</p>
      <div className="post__meta">
        <span>{post.user?.fullName ?? post.user?.login}</span>
        <span>{formatPostDate(post.createdAt)}</span>
        <span className="post__meta-stat">
          <FaRegComment size={13} /> {post.comments?.length ?? 0}
        </span>
      </div>
    </Link>
  );
};
