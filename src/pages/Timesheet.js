import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Schedule from '../components/Schedule/Schedule';
import DraggableUser from '../components/Schedule/DragableUser';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Timesheet() {
    const [users, setUsers] = useState([]);
    const [timesheet, setTimesheet] = useState([]);

    useEffect(() => {
        try {
            const storedTimesheet = sessionStorage.getItem('timesheetData');
            const storedUsers = sessionStorage.getItem('companyUsers'); 
    
            if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                setUsers(parsedUsers);
            }
    
            if (storedTimesheet) {
                const parsedTimesheet = JSON.parse(storedTimesheet);
                setTimesheet(Array.isArray(parsedTimesheet) ? parsedTimesheet : []);
            } else {
                const initialTimesheet = [];
                sessionStorage.setItem('timesheetData', JSON.stringify(initialTimesheet));
                setTimesheet(initialTimesheet);
            }
        } catch (error) {
            console.error('Error parsing session storage data:', error);
        }
    }, []);

    const updateTimesheet = (updatedTimesheet) => {
        sessionStorage.setItem('timesheetData', JSON.stringify(updatedTimesheet));
        setTimesheet(updatedTimesheet);
    };

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Header />
                <div className="App">
                    <Schedule users={users} timesheet={timesheet} updateTimesheet={updateTimesheet} />

                    <div className="staff-container">
                        {users.map(user => (
                            <DraggableUser key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            </DndProvider>
        </>
    );
}

export default Timesheet;