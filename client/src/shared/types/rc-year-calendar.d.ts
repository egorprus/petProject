declare module "rc-year-calendar" {
  import { ComponentType } from "react";

  export interface CalendarDataSource {
    id?: number | string;
    startDate: Date;
    endDate: Date;
    name?: string;
    color?: string;
    [key: string]: unknown;
  }

  export interface CalendarProps {
    style?: "background" | "border" | "custom";
    year?: number;
    defaultYear?: number;
    minDate?: Date;
    maxDate?: Date;
    dataSource?: CalendarDataSource[];
    customDataSourceRenderer?: (element: HTMLElement, date: Date, events: CalendarDataSource[]) => void;
    language?: string;
    displayHeader?: boolean;
    displayWeekNumber?: boolean;
    weekStart?: number;
    enableRangeSelection?: boolean;
    onDayClick?: (event: { date: Date; events: CalendarDataSource[] }) => void;
    onDayEnter?: (event: { date: Date; element: HTMLElement; events: CalendarDataSource[] }) => void;
    onDayLeave?: (event: { date: Date; element: HTMLElement; events: CalendarDataSource[] }) => void;
    onRangeSelected?: (event: { startDate: Date; endDate: Date }) => void;
    onYearChanged?: (event: { currentYear: number }) => void;
  }

  const Calendar: ComponentType<CalendarProps>;
  export default Calendar;
}
