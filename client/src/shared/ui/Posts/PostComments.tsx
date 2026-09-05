import { FormEvent, useState } from "react";
import { PostItem } from "@shared/types/types";
import { useAppDispatch } from "@app/store";
import { updatePost } from "@features/posts/postSlice";
import { postsApi } from "@features/posts/api";
import { ButtonTypes } from "@shared/types/enums";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";

interface Props {
  post: PostItem;
}

export const PostComments = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const updated = await postsApi.addComment(post._id, trimmed);
    dispatch(updatePost(updated));
    setText("");
    setIsSubmitting(false);
  };

  return (
    <div className="post__comments">
      {(post.comments ?? []).map((comment) => (
        <div key={comment._id} className="post__comment">
          <span className="post__comment-author">{comment.user?.fullName ?? comment.user?.login}</span>
          <span>{comment.text}</span>
        </div>
      ))}
      <form className="post__comment-form" onSubmit={handleSubmit}>
        <input
          className="post__comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать комментарий..."
        />
        <DefaultButton
          type={ButtonTypes.submit}
          label="Отправить"
          disabled={isSubmitting || !text.trim()}
        />
      </form>
    </div>
  );
};
