// StaffContext.js
import React, { createContext, useContext, useState } from 'react';

const StaffContext = createContext({ staff: [], setStaff: () => {} });


export const useStaff = () => {
    return useContext(StaffContext);
};

export const StaffProvider = ({ children }) => {
    const [staff, setStaff] = useState([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ]);
    return (
        <StaffContext.Provider value={{ staff, setStaff }}>
            {children}
        </StaffContext.Provider>
    );
};
