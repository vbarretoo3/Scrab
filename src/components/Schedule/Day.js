import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Day = ({ period, day, shifts, notFormattedDate, timesheet, updateTimesheet }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [editingShiftIndex, setEditingShiftIndex] = useState(null);
    const [editingShift, setEditingShift] = useState(null);

    const convertFirestoreTimestampToDate = (timestamp) => {
        const utcDate = new Date(timestamp.seconds * 1000);
        const localDate = new Date(utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset()));
        return localDate;
    };

    const convertLocalDateToUTC = (localDate) => {
        const utcDate = new Date(localDate);
        utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
        return utcDate;
    };    

    const getLocalDateAsString = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };
    

    function isSameDate(dateStr1, dateStr2) {
        const date1 = new Date(dateStr1);
        const date2 = new Date(dateStr2);
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    const matchingDay = timesheet && timesheet.find(entry => isSameDate(entry.date, getLocalDateAsString(notFormattedDate)));
    const shiftsForTheDay = matchingDay ? matchingDay.shifts : [];
    const effectiveShifts = shiftsForTheDay.length ? shiftsForTheDay : (shifts || []);

    const [, ref] = useDrop({
        accept: 'USER',
        drop: (item, monitor) => {
            setSelectedUser(item.user);
            setModalOpen(true);
        },
    });

    const handleConfirm = () => {
        if (startDate >= endDate) {
            alert("Start time cannot be later than or the same as the end time!");
            return;
        }
    
        // Find the local midnight after the start date
        const localMidnightAfterStartDate = new Date(startDate);
        localMidnightAfterStartDate.setHours(24, 0, 0, 1);
        
        let shiftsToAdd = [];
        
        if (endDate > localMidnightAfterStartDate) {
            // First shift: from start to local midnight
            const shift1End = localMidnightAfterStartDate;
            shiftsToAdd.push({
                UserName: selectedUser.Name,
                id: selectedUser.id,
                Start: { seconds: Math.floor(convertLocalDateToUTC(startDate).getTime() / 1000), nanoseconds: 0 },
                End: { seconds: Math.floor(convertLocalDateToUTC(shift1End).getTime() / 1000), nanoseconds: 0 },
                Total: ((Math.floor(shift1End.getTime() / 1000) - Math.floor(startDate.getTime() / 1000)) / 3600)
            });
        
            // Second shift: from local midnight to end
            const shift2Start = new Date(localMidnightAfterStartDate.getTime() + localMidnightAfterStartDate.getTimezoneOffset() * 60000);
            shiftsToAdd.push({
                UserName: selectedUser.Name,
                id: selectedUser.id,
                Start: { seconds: Math.floor(convertLocalDateToUTC(shift2Start).getTime() / 1000), nanoseconds: 0 },
                End: { seconds: Math.floor(convertLocalDateToUTC(endDate).getTime() / 1000), nanoseconds: 0 },
                Total: ((Math.floor(endDate.getTime() / 1000) - Math.floor(shift2Start.getTime() / 1000)) / 3600)
            });
        } else {
            shiftsToAdd.push({
                UserName: selectedUser.Name,
                id: selectedUser.id,
                Start: { seconds: Math.floor(convertLocalDateToUTC(startDate).getTime() / 1000), nanoseconds: 0 },
                End: { seconds: Math.floor(convertLocalDateToUTC(endDate).getTime() / 1000), nanoseconds: 0 },
                Total: ((Math.floor(endDate.getTime() / 1000) - Math.floor(startDate.getTime() / 1000)) / 3600)
            });
        }
        
        let updatedTimesheet = [...timesheet];
    
        // Check if editingShift or its Start is defined
        if (editingShift && !editingShift.data.Start) {
            console.error("Editing shift start time is not defined.");
            return;
        }
    
        // First, remove the shift being edited:
        if (editingShift) {
            const matchingDateEntryForEditing = timesheet.find(entry => isSameDate(entry.date, getLocalDateAsString(new Date(editingShift.data?.Start?.seconds * 1000))));
            if (matchingDateEntryForEditing) {
                const idx = matchingDateEntryForEditing.shifts.findIndex(s => 
                    s.UserName === editingShift.data.UserName && 
                    s.Start.seconds === editingShift.data.Start.seconds && 
                    s.End.seconds === editingShift.data.End.seconds
                );
                if (idx !== -1) {
                    matchingDateEntryForEditing.shifts.splice(idx, 1);
                }
            }
        }
    
        // Next, add the new shifts:
        for (let shift of shiftsToAdd) {
            const matchingDateEntry = timesheet.find(entry => isSameDate(entry.date, getLocalDateAsString(new Date(shift.Start.seconds * 1000))));
            console.log(shift)
            console.log(getLocalDateAsString(new Date(shift.Start.seconds * 1000)))
                    
            if (matchingDateEntry) {
                matchingDateEntry.shifts.push(shift);
            } else {
                const newDateEntry = {  
                    date: getLocalDateAsString(new Date(shift.Start.seconds * 1000)),
                    shifts: [shift]
                };
                updatedTimesheet.push(newDateEntry);
            }
        }
    
        // Cleanup
        updateTimesheet(updatedTimesheet);
        setModalOpen(false);
        setSelectedUser(null);
        setEditingShiftIndex(null);
        setEditingShift(null);
    };
           

    const handleEditShift = (index) => {
        const shiftToEdit = effectiveShifts[index];
        setSelectedUser({ Name: shiftToEdit.UserName, id: shiftToEdit.id });
        setStartDate(convertFirestoreTimestampToDate(shiftToEdit.Start));
        setEndDate(convertFirestoreTimestampToDate(shiftToEdit.End));
        setEditingShift({
            data: shiftToEdit,
            index: index
        });
        setModalOpen(true);
    };

    const handleDeleteShift = () => {
        if (matchingDay && editingShift && editingShift.index !== undefined) {
            matchingDay.shifts.splice(editingShift.index, 1);
            updateTimesheet([...timesheet]);
        }
        setModalOpen(false);
        setSelectedUser(null);
        setEditingShift(null);
    };

    return (
        <div ref={ref} className={period === 'Weekly' ? 'day-container' : 'day-container-daily'}>
            <strong>{day}</strong>
            {effectiveShifts.map((shift, i) => (
                <div className={period === 'Weekly' ? 'schedule-shifts' : 'schedule-shifts-daily'} key={i} onClick={() => handleEditShift(i)}>
                    <strong>{shift.UserName}</strong>
                    Start: {convertFirestoreTimestampToDate(shift.Start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    <br/>
                    End: {convertFirestoreTimestampToDate(shift.End).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
            ))}
            <Modal className='schedule-modal' isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
                <h2>Schedule for {selectedUser?.Name}</h2>
                <div>
                    <strong>Start Time:</strong>
                    <DatePicker className='schedule-date-picker' selected={startDate} onChange={date => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                </div>
                <br/>
                <div>
                    <strong>End Time:</strong>
                    <DatePicker className='schedule-date-picker' selected={endDate} onChange={date => setEndDate(date)} showTimeSelect dateFormat="Pp" />
                </div>
                <br/>
                <div className='schedule-modal-buttons'>
                <button className='schedule-modal-button-confirm' onClick={handleConfirm}>Confirm</button>
                <button className='schedule-modal-button-cancel' onClick={() => setModalOpen(false)}>Cancel</button>
                {editingShift !== null && (
                    <button className='schedule-modal-button-delete' onClick={handleDeleteShift}>Delete Shift</button>
                )}
                </div>
            </Modal>
        </div>
    );
};

export default Day;