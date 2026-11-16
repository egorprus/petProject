import { PostCard } from "./PostCard";
import { PostItem } from "@shared/types/types";

interface Props {
  posts: PostItem[];
}
export const PostsList = ({ posts }: Props) => {
  return (
    <ul className="posts">
      {posts.map((item: PostItem) => (
        <li className="posts__item" key={item._id}>
          <PostCard post={item} />
        </li>
      ))}
    </ul>
  );
};
