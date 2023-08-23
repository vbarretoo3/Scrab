import React from 'react';
import Day from './Day';

const DayView = ({ day, timesheet, updateTimesheet, onDropUser }) => {
  // Format the day
  const formattedDay = `${day.toDateString().split(' ').slice(0, 3).join(' ')}`;

  return (
    <div className="daily-schedule-container">
      <Day day={formattedDay} updateTimesheet={updateTimesheet} notFormattedDate={day}  timesheet={timesheet} onDropUser={onDropUser} />
    </div>
  );
};

export default DayView;
