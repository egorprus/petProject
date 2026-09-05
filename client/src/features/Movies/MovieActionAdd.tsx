import { Modal } from "@features/Modal/Modal";
import { useModal } from "@features/Modal/useModal";
import { ButtonTypes, RequiredFields } from "@shared/types/enums";
import { MovieFormData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { SelectField } from "@shared/ui/Fields/Select/SelectField";
import { CheckboxField } from "@shared/ui/Fields/Checkbox/CheckboxField";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { GENRE_OPTIONS, RATING_OPTIONS } from "@features/Movies/movieOptions";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEdit, MdAdd } from "react-icons/md";
import styles from "./style.module.scss";

interface Props {
  onSubmit: (data: MovieFormData) => Promise<void> | void;
  item?: MovieFormData;
}

const FIELDS = {
  title: { name: RequiredFields.title, label: "Title" },
  genre: { name: RequiredFields.genre, label: "Genre" },
  rating: { name: RequiredFields.rating, label: "Rating" },
  notWatched: { name: RequiredFields.notWatched, label: "Не просмотрено" },
  isSeries: { name: RequiredFields.isSeries, label: "Это сериал" },
} as const;

export const MovieActionAdd = ({ onSubmit: onSave, item }: Props) => {
  const modal = useModal();
  const isEdit = !!item;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormData>({ defaultValues: item });

  const notWatched = watch(RequiredFields.notWatched);

  useEffect(() => {
    if (modal.isOpen) reset(item);
  }, [modal.isOpen]);

  useEffect(() => {
    if (notWatched) setValue(RequiredFields.rating, "");
  }, [notWatched]);

  const onSubmit: SubmitHandler<MovieFormData> = async (data) => {
    await onSave({ ...data, favorite: item?.favorite ?? false });
    reset();
    modal.close();
  };

  return (
    <>
      {isEdit ? (
        <button className={styles.iconButton} onClick={modal.open}>
          <MdEdit size={18} />
        </button>
      ) : (
        <button className={styles.iconButton} onClick={modal.open}>
          <MdAdd size={18} />
        </button>
      )}

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <FieldWrapper name={FIELDS.title.name} label={FIELDS.title.label} errors={errors.title}>
            <InputText register={register(FIELDS.title.name, { required: true })} autoFocus />
          </FieldWrapper>
          <FieldWrapper name={FIELDS.genre.name} label={FIELDS.genre.label} errors={errors.genre}>
            <SelectField
              options={GENRE_OPTIONS}
              errors={errors.genre}
              register={register(FIELDS.genre.name, { required: true })}
              onChange={(option) => option && setValue(FIELDS.genre.name, option.value)}
            />
          </FieldWrapper>
          <FieldWrapper name={FIELDS.rating.name} label={FIELDS.rating.label} errors={errors.rating}>
            <SelectField
              options={RATING_OPTIONS}
              errors={errors.rating}
              register={register(FIELDS.rating.name)}
              onChange={(option) => setValue(FIELDS.rating.name, option ? option.value : "")}
            />
          </FieldWrapper>
          <CheckboxField label={FIELDS.notWatched.label} register={register(FIELDS.notWatched.name)} />
          <CheckboxField label={FIELDS.isSeries.label} register={register(FIELDS.isSeries.name)} />
          <DefaultButton type={ButtonTypes.submit} label={isEdit ? "Save" : "Submit"} disabled={isSubmitting} />
        </form>
      </Modal>
    </>
  );
};
