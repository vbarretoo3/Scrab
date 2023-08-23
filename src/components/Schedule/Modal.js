import React, { useState } from 'react';

const Modal = ({ timesheet, setTimesheet, editingShift, onClose }) => {
  const { day, shiftIndex } = editingShift;
  const shift = timesheet[day][shiftIndex];

  const [startTime, setStartTime] = useState(shift.startTime);
  const [endTime, setEndTime] = useState(shift.endTime);

  const handleSave = () => {
    const updatedDay = [...timesheet[day]];
    updatedDay[shiftIndex] = { ...shift, startTime, endTime };
    setTimesheet(prev => ({ ...prev, [day]: updatedDay }));
    onClose();
  };

  return (
    <div>
      <h2>Edit Shift</h2>
      <label>
        Start Time: 
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
      </label>
      <label>
        End Time: 
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Modal;
