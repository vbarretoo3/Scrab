import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Day = ({ clickableUser, setModal, period, day, shifts, notFormattedDate, timesheet, updateTimesheet }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState(new Date(notFormattedDate.getTime()));
    const [endDate, setEndDate] = useState(new Date((notFormattedDate.getTime())));
    const [editingShiftIndex, setEditingShiftIndex] = useState(null);
    const [editingShift, setEditingShift] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [repeatOnMon, setRepeatOnMon] = useState(false);
    const [repeatOnTue, setRepeatOnTue] = useState(false);
    const [repeatOnWed, setRepeatOnWed] = useState(false);
    const [repeatOnThu, setRepeatOnThu] = useState(false);
    const [repeatOnFri, setRepeatOnFri] = useState(false);
    const [repeatOnSat, setRepeatOnSat] = useState(false);
    const [repeatOnSun, setRepeatOnSun] = useState(false);
    const [repeatOnWek, setRepeatOnWek] = useState(false);

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

    setModal(prevModal => {
        if (prevModal) {
            setStartDate(new Date());
            setEndDate(new Date());
            setSelectedUser(clickableUser)
            setModalOpen(true);
            return false;  // Set modal to false
        }
        return prevModal;  // Keep it unchanged
    });
    

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

    const generateShift = (date) => {
        // Clone the given date to avoid modifying the original
        const baseDate = new Date(date);
      
        // Extract the hours, minutes, seconds, and milliseconds from the start and end dates
        const startHours = startDate.getHours();
        const startMinutes = startDate.getMinutes();
      
        const endHours = endDate.getHours();
        const endMinutes = endDate.getMinutes();
      
        // Set the hours, minutes, seconds, and milliseconds to the cloned baseDate
        baseDate.setHours(startHours, startMinutes);
        const newStartDate = new Date(baseDate);
      
        baseDate.setHours(endHours, endMinutes);
        const newEndDate = new Date(baseDate);
      
        // Now, return the shift for the new date
        return {
          UserName: selectedUser.Name,
          id: selectedUser.id,
          Start: { 
            seconds: Math.floor(convertLocalDateToUTC(newStartDate).getTime() / 1000), 
            nanoseconds: 0 
          },
          End: { 
            seconds: Math.floor(convertLocalDateToUTC(newEndDate).getTime() / 1000), 
            nanoseconds: 0 
          },
          Total: ((Math.floor(newEndDate.getTime() / 1000) - Math.floor(newStartDate.getTime() / 1000)) / 3600)
        };
      };

    const handleConfirm = () => {
        if (startDate >= endDate) {
            alert("Start time cannot be later than or the same as the end time!");
            return;
        }

        let shiftsToAdd = [];

        if (isChecked){
            let dayShiftsToAdd = [];
            const baseDate = new Date(startDate);
            while (baseDate.getDay() !== 1) {
                baseDate.setDate(baseDate.getDate() - 1);
            }
            
            if (repeatOnMon || repeatOnWek) {
                const shiftForMon = generateShift(baseDate);
                dayShiftsToAdd.push(shiftForMon);
            }

            if (repeatOnTue || repeatOnWek) {
                const tuesday = new Date(baseDate);
                tuesday.setDate(tuesday.getDate() + 1);
                const shiftForTue = generateShift(tuesday);
                dayShiftsToAdd.push(shiftForTue);
            }

            if (repeatOnWed || repeatOnWek) {
                const wednesday = new Date(baseDate);
                wednesday.setDate(wednesday.getDate() + 2);
                const shiftForWed = generateShift(wednesday);
                dayShiftsToAdd.push(shiftForWed);
            }

            if (repeatOnThu || repeatOnWek) {
                const thursday = new Date(baseDate);
                thursday.setDate(thursday.getDate() + 3);
                const shiftForThu = generateShift(thursday);
                dayShiftsToAdd.push(shiftForThu);
            }

            if (repeatOnFri || repeatOnWek) {
                const friday = new Date(baseDate);
                friday.setDate(friday.getDate() + 4);
                const shiftForFri = generateShift(friday);
                dayShiftsToAdd.push(shiftForFri);
            }

            if (repeatOnSat || repeatOnWek) {
                const saturday = new Date(baseDate);
                saturday.setDate(saturday.getDate() + 5);
                const shiftForSat = generateShift(saturday);
                dayShiftsToAdd.push(shiftForSat);
            }

            if (repeatOnSun || repeatOnWek) {
                const sunday = new Date(baseDate);
                sunday.setDate(sunday.getDate() + 6);
                const shiftForSun = generateShift(sunday);
                dayShiftsToAdd.push(shiftForSun);
            }

            // Merge these into your main shifts array
            shiftsToAdd = shiftsToAdd.concat(dayShiftsToAdd);
            
        } else {
            // Find the local midnight after the start date
            const localMidnightAfterStartDate = new Date(startDate);
            localMidnightAfterStartDate.setHours(24, 0, 0, 1);
            
            
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
                {period === 'Weekly'? 
                <>
                    {editingShift === null && (
                    <div>
                        <input checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} type="checkbox"/>
                        <label>Repeat shift</label>
                        <br/>
                    </div>
                    )}
                    <br/>
                    {isChecked === true && (
                        <div className='week-repeat'>
                            <input checked={repeatOnMon} onChange={(e) => setRepeatOnMon(e.target.checked)} type="checkbox"/>
                            <label>Monday</label>
                            <input checked={repeatOnTue} onChange={(e) => setRepeatOnTue(e.target.checked)} type="checkbox"/>
                            <label>Tuesday</label>
                            <input checked={repeatOnWed} onChange={(e) => setRepeatOnWed(e.target.checked)} type="checkbox"/>
                            <label>Wednesday</label>
                            <input checked={repeatOnThu} onChange={(e) => setRepeatOnThu(e.target.checked)} type="checkbox"/>
                            <label>Thursday</label>
                            <input checked={repeatOnFri} onChange={(e) => setRepeatOnFri(e.target.checked)} type="checkbox"/>
                            <label>Friday</label>
                            <input checked={repeatOnSat} onChange={(e) => setRepeatOnSat(e.target.checked)} type="checkbox"/>
                            <label>Saturday</label>
                            <input checked={repeatOnSun} onChange={(e) => setRepeatOnSun(e.target.checked)} type="checkbox"/>
                            <label>Sunday</label>
                            <input checked={repeatOnWek} onChange={(e) => setRepeatOnWek(e.target.checked)} type="checkbox"/>
                            <label>All Week</label>
                        </div>
                    )}
                    <br/>
                </>
                :
                <>
                </>
                }
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