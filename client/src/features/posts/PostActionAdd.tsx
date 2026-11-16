import { Modal } from "@features/Modal/Modal";
import { useModal } from "@features/Modal/useModal";
import { ButtonTypes } from "@shared/types/enums";
import { PostItem } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { TextareaField } from "@shared/ui/Fields/Textarea/TextareaField";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdEdit } from "react-icons/md";
import styles from "@features/Bank/style.module.scss";
import { useCreatePostMutation, useUpdatePostMutation } from "./postsApi";

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
  const [updatePost] = useUpdatePostMutation();
  const [createPost] = useCreatePostMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: post ? { title: post.title, text: post.text } : undefined,
  });

  useEffect(() => {
    if (modal.isOpen) {
      reset(
        post ? { title: post.title, text: post.text } : { title: "", text: "" },
      );
    }
  }, [modal.isOpen]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isEdit) {
      await updatePost({ id: post._id, ...data }).unwrap();
    } else {
      await createPost({ ...data });
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <FieldWrapper label="Title" name="title" errors={errors.title}>
            <InputText register={register("title", { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Text" name="text" errors={errors.text}>
            <TextareaField register={register("text", { required: true })} />
          </FieldWrapper>
          <DefaultButton
            type={ButtonTypes.submit}
            label={isEdit ? "Save" : "Create"}
            disabled={isSubmitting}
          />
        </form>
      </Modal>
    </>
  );
};
