import React from "react";
import Day from "./Day";

const DayView = ({ setModal, day, timesheet, updateTimesheet, onDropUser }) => {
  // Format the day
  const formattedDay = `${day.toDateString().split(" ").slice(0, 3).join(" ")}`;

  return (
    <div className="daily-schedule-container">
      <Day
        setModal={setModal}
        day={formattedDay}
        updateTimesheet={updateTimesheet}
        notFormattedDate={day}
        timesheet={timesheet}
        onDropUser={onDropUser}
      />
    </div>
  );
};

export default DayView;
