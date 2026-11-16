import { FormEvent, KeyboardEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { PostComment } from "@shared/types/types";
import { ButtonTypes } from "@shared/types/enums";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import {
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@features/posts/postsApi";
import { formatPostDate } from "./PostCard";

interface Props {
  postId: string;
  comment: PostComment;
  canManage: boolean;
}

export const PostCommentItem = ({ postId, comment, canManage }: Props) => {
  const [updateComment, { isLoading: isSaving }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const startEdit = () => {
    setText(comment.text);
    setIsEditing(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (trimmedText !== comment.text) {
      await updateComment({
        id: postId,
        commentId: comment._id,
        text: trimmedText,
      }).unwrap();
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <div className="post__comment">
      <div className="post__comment-header">
        <span className="post__comment-author">
          {comment.user?.fullName ?? comment.user?.login}
        </span>
        <span className="post__comment-date">
          {formatPostDate(comment.createdAt)}
        </span>
        {canManage && !isEditing && (
          <>
            <button className="post__icon-btn" onClick={startEdit}>
              <MdEdit size={14} />
            </button>
            <button
              className="post__icon-btn"
              onClick={() => deleteComment({ id: postId, commentId: comment._id })}
            >
              <FaTrash size={12} />
            </button>
          </>
        )}
      </div>
      {isEditing ? (
        <form className="post__comment-form" onSubmit={handleSave}>
          <input
            className="post__comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <DefaultButton
            type={ButtonTypes.submit}
            label="Сохранить"
            disabled={isSaving || !text.trim()}
          />
          <DefaultButton
            type={ButtonTypes.button}
            label="Отмена"
            handleClick={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <p className="post__comment-text">{comment.text}</p>
      )}
    </div>
  );
};
