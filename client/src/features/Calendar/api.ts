import axiosInstance from "@shared/api/axios";
import { CalendarEventFormData } from "@shared/types/types";

type CalendarEventPayload = Omit<CalendarEventFormData, "_id">;

export const calendarApi = {
  getAll: (year: number): Promise<CalendarEventFormData[]> =>
    axiosInstance.get("/calendar-events", { params: { year } }).then((r) => r.data),

  create: (data: CalendarEventPayload): Promise<CalendarEventFormData> =>
    axiosInstance.post("/calendar-events", data).then((r) => r.data),

  update: (id: string, data: CalendarEventPayload): Promise<void> =>
    axiosInstance.patch(`/calendar-events/${id}`, data).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosInstance.delete(`/calendar-events/${id}`).then((r) => r.data),
};
