import { useLayoutEffect, useRef } from "react";
import Calendar from "rc-year-calendar";
import "js-year-calendar/dist/js-year-calendar.css";
import { Popover } from "react-tiny-popover";
import { CalendarEventModal } from "@features/Calendar/CalendarEventModal";
import { groupEvents, highlightToday, renderEventDots } from "@features/Calendar/calendarUtils";
import { useCalendarData } from "@features/Calendar/useCalendarData";
import { useDayHoverPopover } from "@features/Calendar/useDayHoverPopover";
import styles from "./style.module.scss";

export const CalendarPage = () => {
  const {
    year,
    setYear,
    dataSource,
    selectedDate,
    dayEvents,
    isModalOpen,
    closeModal,
    handleDayClick,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useCalendarData();

  const { hoveredDay, handleDayEnter, handleDayLeave } = useDayHoverPopover();

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      highlightToday(containerRef.current, year, styles.today);
    }
  }, [year, dataSource]);

  return (
    <>
      <div ref={containerRef}>
        <Calendar
          dataSource={dataSource}
          defaultYear={year}
          onYearChanged={(e) => setYear(e.currentYear)}
          onDayClick={(e) => handleDayClick(e.date)}
          onDayEnter={handleDayEnter}
          onDayLeave={handleDayLeave}
          customDataSourceRenderer={renderEventDots}
          style="custom"
        />
      </div>
      {hoveredDay && (
        <Popover
          isOpen
          content={
            <div className={styles.dayPopover}>
              <div className={styles.dayPopoverDate}>{hoveredDay.date.toLocaleDateString()}</div>
              <div className={styles.dayPopoverList}>
                {groupEvents(hoveredDay.events).map((group) => (
                  <div key={group.key} className={styles.dayPopoverItem}>
                    <span className={styles.dayPopoverDot} style={{ background: group.color }} />
                    <span>
                      {group.name}
                      {group.count > 1 ? ` ×${group.count}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
          positions={["top", "bottom", "left", "right"]}
        >
          <div
            style={{
              position: "fixed",
              top: hoveredDay.rect.top,
              left: hoveredDay.rect.left,
              width: hoveredDay.rect.width,
              height: hoveredDay.rect.height,
              pointerEvents: "none",
            }}
          />
        </Popover>
      )}
      <CalendarEventModal
        isOpen={isModalOpen}
        initialDate={selectedDate}
        dayEvents={dayEvents}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};
