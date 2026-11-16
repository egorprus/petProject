import { FormEvent, useState } from "react";
import { PostItem } from "@shared/types/types";
import { ButtonTypes } from "@shared/types/enums";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { useAddCommentMutation } from "@features/posts/postsApi";

interface Props {
  post: PostItem;
}

export const PostComments = ({ post }: Props) => {
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [text, setText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    await addComment({ id: post._id, text: trimmedText }).unwrap();
    setText("");
  };

  return (
    <div className="post__comments">
      {(post.comments ?? []).map((comment) => (
        <div key={comment._id} className="post__comment">
          <span className="post__comment-author">
            {comment.user?.fullName ?? comment.user?.login}
          </span>
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
          disabled={isLoading || !text.trim()}
        />
      </form>
    </div>
  );
};
