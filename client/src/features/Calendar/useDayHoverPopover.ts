import { useState } from "react";
import type { CalendarDataSource } from "rc-year-calendar";

export const useDayHoverPopover = () => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    rect: DOMRect;
    events: CalendarDataSource[];
  } | null>(null);

  const handleDayEnter = (e: { date: Date; element: HTMLElement; events: CalendarDataSource[] }) => {
    if (e.events.length === 0) return;
    setHoveredDay({ date: e.date, rect: e.element.getBoundingClientRect(), events: e.events });
  };

  const handleDayLeave = () => setHoveredDay(null);

  return { hoveredDay, handleDayEnter, handleDayLeave };
};
