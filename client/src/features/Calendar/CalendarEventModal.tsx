import { Modal } from "@features/Modal/Modal";
import { ButtonTypes, CalendarEventType, RequiredFields } from "@shared/types/enums";
import { CalendarEventFormData } from "@shared/types/types";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { InputText } from "@shared/ui/Fields/InputText/InputText";
import { DatePickerField } from "@shared/ui/Fields/DatePicker/DatePickerField";
import { SelectField } from "@shared/ui/Fields/Select/SelectField";
import { CheckboxField } from "@shared/ui/Fields/Checkbox/CheckboxField";
import { FieldWrapper } from "@shared/ui/Fields/FieldWrapper";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import styles from "./style.module.scss";

interface Props {
  isOpen: boolean;
  initialDate: Date | null;
  dayEvents: CalendarEventFormData[];
  onClose: () => void;
  onCreate: (data: CalendarEventFormData) => Promise<void> | void;
  onUpdate: (id: string, data: CalendarEventFormData) => Promise<void> | void;
  onDelete: (id: string) => void;
}

const TYPE_OPTIONS = [
  { value: CalendarEventType.birthday, label: "Birthday" },
  { value: CalendarEventType.meeting, label: "Meeting" },
  { value: CalendarEventType.task, label: "Task" },
  { value: CalendarEventType.reminder, label: "Reminder" },
  { value: CalendarEventType.holiday, label: "Holiday" },
  { value: CalendarEventType.other, label: "Other" },
];

const TYPE_LABELS = Object.fromEntries(TYPE_OPTIONS.map((option) => [option.value, option.label]));

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const FIELDS = {
  startDate: { name: RequiredFields.startDate, label: "Start date" },
  endDate: { name: RequiredFields.endDate, label: "End date" },
  description: { name: RequiredFields.description, label: "Description" },
  type: { name: RequiredFields.type, label: "Type" },
  isRecurring: { name: RequiredFields.isRecurring, label: "Repeat every year" },
} as const;

export const CalendarEventModal = ({
  isOpen,
  initialDate,
  dayEvents,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CalendarEventFormData>();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const isoDate = initialDate ? initialDate.toISOString() : "";
      reset({ startDate: isoDate, endDate: isoDate });
      setStartDate(initialDate);
      setEndDate(initialDate);
      setEditingId(null);
    }
  }, [isOpen, initialDate]);

  const handleEditClick = (event: CalendarEventFormData) => {
    setEditingId(event._id ?? null);
    reset(event);
    setStartDate(new Date(event.startDate));
    setEndDate(new Date(event.endDate));
  };

  const handleDeleteClick = (id?: string) => {
    if (id) onDelete(id);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setValue(RequiredFields.startDate, date ? date.toISOString() : "");
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setValue(RequiredFields.endDate, date ? date.toISOString() : "");
  };

  const onSubmit: SubmitHandler<CalendarEventFormData> = async (data) => {
    if (editingId) {
      await onUpdate(editingId, data);
    } else {
      await onCreate(data);
    }
    reset();
    setEditingId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {dayEvents.length > 0 && (
        <ul className={styles.eventList}>
          {dayEvents.map((event) => (
            <li key={event._id} className={styles.eventListItem}>
              <span>
                {formatDate(event.startDate)} — {TYPE_LABELS[event.type]}: {event.description}
              </span>
              <span className={styles.eventListItemActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => handleEditClick(event)}
                >
                  <MdEdit size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => handleDeleteClick(event._id)}
                >
                  <FaTrash size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper name={FIELDS.startDate.name} label={FIELDS.startDate.label} errors={errors.startDate}>
          <DatePickerField
            selected={startDate}
            onChange={handleStartDateChange}
            register={register(FIELDS.startDate.name, { required: true })}
          />
        </FieldWrapper>
        <FieldWrapper name={FIELDS.endDate.name} label={FIELDS.endDate.label} errors={errors.endDate}>
          <DatePickerField
            selected={endDate}
            onChange={handleEndDateChange}
            register={register(FIELDS.endDate.name, { required: true })}
          />
        </FieldWrapper>
        <FieldWrapper name={FIELDS.description.name} label={FIELDS.description.label} errors={errors.description}>
          <InputText register={register(FIELDS.description.name, { required: true })} />
        </FieldWrapper>
        <FieldWrapper name={FIELDS.type.name} label={FIELDS.type.label} errors={errors.type}>
          <SelectField
            options={TYPE_OPTIONS}
            errors={errors.type}
            register={register(FIELDS.type.name, { required: true })}
            onChange={(option) => {
              if (!option) return;
              setValue(FIELDS.type.name, option.value);
              setValue(FIELDS.isRecurring.name, option.value === CalendarEventType.birthday);
            }}
          />
        </FieldWrapper>
        <CheckboxField label={FIELDS.isRecurring.label} register={register(FIELDS.isRecurring.name)} />
        <div className={styles.actions}>
          <DefaultButton type={ButtonTypes.submit} label={editingId ? "Update" : "Save"} disabled={isSubmitting} />
          <DefaultButton type={ButtonTypes.button} label="Close" handleClick={onClose} disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};
