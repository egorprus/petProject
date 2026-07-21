import { Modal } from "@features/Modal/Modal";
import { useModal } from "@features/Modal/useModal";
import { ButtonTypes } from "@shared/types/enums";
import { PostItem } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdEdit } from "react-icons/md";
import { useAppDispatch } from "@app/store";
import { addPost, updatePost } from "./postSlice";
import { postsApi } from "./api";
import styles from "@features/Bank/style.module.scss";

interface FormData {
  title: string;
  text: string;
}

interface Props {
  post?: PostItem;
}

export const PostActionAdd = ({ post }: Props) => {
  const modal = useModal();
  const isEdit = !!post;
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: post ? { title: post.title, text: post.text } : undefined,
  });

  useEffect(() => {
    if (modal.isOpen) {
      reset(post ? { title: post.title, text: post.text } : { title: "", text: "" });
    }
  }, [modal.isOpen]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isEdit) {
      await postsApi.update(post._id, { ...data, status: post.status });
      dispatch(updatePost({ ...post, ...data }));
    } else {
      const created = await postsApi.create(data);
      dispatch(addPost(created));
    }
    reset();
    modal.close();
  };

  return (
    <>
      <button className={styles.iconButton} onClick={modal.open}>
        {isEdit ? <MdEdit size={18} /> : <MdAdd size={22} />}
      </button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <FieldWrapper label="Title" name="title" errors={errors.title}>
            <InputText register={register("title", { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Text" name="text" errors={errors.text}>
            <InputText register={register("text", { required: true })} />
          </FieldWrapper>
          <DefaultButton type={ButtonTypes.submit} label={isEdit ? "Save" : "Create"} />
        </form>
      </Modal>
    </>
  );
};
