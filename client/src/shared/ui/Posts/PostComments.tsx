import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import { PostItem } from "@shared/types/types";
import { ButtonTypes } from "@shared/types/enums";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { useAddCommentMutation } from "@features/posts/postsApi";
import { PostCommentItem } from "./PostCommentItem";

interface Props {
  post: PostItem;
}

export const PostComments = ({ post }: Props) => {
  const userId = useSelector((state: RootState) => state.user.data?._id);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [text, setText] = useState("");
  const comments = post.comments ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    await addComment({ id: post._id, text: trimmedText }).unwrap();
    setText("");
  };

  return (
    <div className="post__comments">
      <h3 className="post__comments-title">Комментарии ({comments.length})</h3>
      {comments.map((comment) => (
        <PostCommentItem
          key={comment._id}
          postId={post._id}
          comment={comment}
          canManage={!!userId && comment.user?._id === userId}
        />
      ))}
      {userId && (
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
      )}
    </div>
  );
};
