import { useEffect, useMemo, useRef, useState } from "react";
import { calendarApi } from "./api";
import { isDayWithinEvent, mapEventsToDataSource } from "./calendarUtils";
import { CalendarEventFormData } from "@shared/types/types";

export const useCalendarData = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [events, setEvents] = useState<CalendarEventFormData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEventFormData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    calendarApi.getAll(year).then((data) => setEvents(Array.isArray(data) ? data : []));
  }, [year]);

  const eventsRef = useRef<CalendarEventFormData[]>(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  const dataSource = useMemo(() => mapEventsToDataSource(events), [events]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDayEvents(eventsRef.current.filter((event) => isDayWithinEvent(date, event)));
    setIsModalOpen(true);
  };

  const handleCreate = async (data: CalendarEventFormData) => {
    const created = await calendarApi.create(data);
    setEvents((prev) => [...prev, created]);
    setDayEvents((prev) => [...prev, created]);
  };

  const handleUpdate = async (id: string, data: CalendarEventFormData) => {
    await calendarApi.update(id, data);
    const updated = { ...data, _id: id };
    setEvents((prev) => prev.map((event) => (event._id === id ? updated : event)));
    setDayEvents((prev) => prev.map((event) => (event._id === id ? updated : event)));
  };

  const handleDelete = async (id: string) => {
    await calendarApi.remove(id);
    setEvents((prev) => prev.filter((event) => event._id !== id));
    setDayEvents((prev) => prev.filter((event) => event._id !== id));
  };

  return {
    year,
    setYear,
    dataSource,
    selectedDate,
    dayEvents,
    isModalOpen,
    closeModal: () => setIsModalOpen(false),
    handleDayClick,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
