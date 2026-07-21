import type { CalendarDataSource } from "rc-year-calendar";
import { CalendarEventType } from "@shared/types/enums";
import { CalendarEventFormData } from "@shared/types/types";

export const TYPE_COLORS: Record<CalendarEventType, string> = {
  [CalendarEventType.birthday]: "#4285f4",
  [CalendarEventType.meeting]: "#28ce97",
  [CalendarEventType.task]: "#ab47bc",
  [CalendarEventType.reminder]: "#f4b400",
  [CalendarEventType.holiday]: "#e53935",
  [CalendarEventType.other]: "#9e9e9e",
};

export const toDayTimestamp = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const isDayWithinEvent = (day: Date, event: CalendarEventFormData) => {
  const dayTime = toDayTimestamp(day);
  return (
    dayTime >= toDayTimestamp(new Date(event.startDate)) &&
    dayTime <= toDayTimestamp(new Date(event.endDate))
  );
};

export const groupEvents = (events: CalendarDataSource[]) => {
  const groups = new Map<string, { color: string; names: string[] }>();
  events.forEach((event) => {
    const color = String(event.color ?? "#9e9e9e");
    const name = String(event.name ?? "");
    const existing = groups.get(color);
    if (existing) {
      existing.names.push(name);
    } else {
      groups.set(color, { color, names: [name] });
    }
  });
  return Array.from(groups.entries()).map(([color, value]) => ({
    key: color,
    color: value.color,
    name: value.names.join(", "),
    count: value.names.length,
  }));
};

export const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const mapEventsToDataSource = (events: CalendarEventFormData[]): CalendarDataSource[] =>
  events.map((event) => ({
    id: event._id,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    name: event.description,
    color: TYPE_COLORS[event.type],
  }));
