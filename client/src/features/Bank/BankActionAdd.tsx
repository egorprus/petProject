import { Modal } from "@features/Modal/Modal";
import { useModal } from "@features/Modal/useModal";
import { ButtonTypes, RequiredFields } from "@shared/types/enums";
import { BankFormData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { DatePickerField } from "@shared/ui/Fields/DatePicker/DatePickerField";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEdit, MdAdd } from "react-icons/md";
import styles from "./style.module.scss";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";

interface Props {
  onSubmit: (data: BankFormData) => void;
  item?: BankFormData;
}

export const BankActionAdd = ({ onSubmit: onSave, item }: Props) => {
  const modal = useModal();
  const isEdit = !!item;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BankFormData>({ defaultValues: item });

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    item?.date ? new Date(item.date) : null
  );

  useEffect(() => {
    if (modal.isOpen) {
      reset(item);
      setSelectedDate(item?.date ? new Date(item.date) : null);
    }
  }, [modal.isOpen]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue(RequiredFields.date, date ? date.toISOString() : '');
  };

  const onSubmit: SubmitHandler<BankFormData> = (data: BankFormData) => {
    onSave(data);
    reset();
    setSelectedDate(null);
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
          
          <FieldWrapper
            label={FIELDS.date.label}
            name={FIELDS.date.name}
            errors={errors.date}
          >
            <DatePickerField
              selected={selectedDate}
              onChange={handleDateChange}
              register={register(RequiredFields.date, { required: true })}
            />
          </FieldWrapper>
          <FieldWrapper
            name={FIELDS.expected.name}
            label={FIELDS.expected.label}
            errors={errors.expected}
          >
            <InputText
              {...FIELDS.expected}
              register={register(RequiredFields.expected)}
            />
          </FieldWrapper>
          <FieldWrapper
            name={FIELDS.received.name}
            label={FIELDS.received.label}
            errors={errors.received}
          >
            <InputText
              {...FIELDS.received}
              register={register(RequiredFields.received)}
            />
          </FieldWrapper>
          <DefaultButton type={ButtonTypes.submit} label={isEdit ? "Save" : "Submit"} />
        </form>
      </Modal>
    </>
  );
};

const FIELDS = {
  expected: { name: RequiredFields.expected, label: "Expected" },
  received: { name: RequiredFields.received, label: "Received" },
  date: {name: RequiredFields.date, label: 'Date'}
};
