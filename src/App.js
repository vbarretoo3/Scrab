import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import './style/App.css';
import Timesheet from './pages/Timesheet';
import DataFetcher from './components/DataFetcher';

function App() {
    const [user, setUser] = useState('HlHfbVnLx3nEJA7snL2L');
    const [isDataLoaded, setDataLoaded] = useState(false);

    /* 
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
        setUser(currentUser);
    });

    // Cleanup the observer on unmount
    useEffect(() => {
        return () => unsubscribe();
    }, []);
    */

    return (
        <>
            <div>
                {user && <DataFetcher userId={user} onDataLoaded={setDataLoaded} />}
            </div>
            {isDataLoaded && (
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/solutions" element={<Homepage />} />
                    <Route path="/pricing" element={<Homepage />} />
                    <Route path="/resources" element={<Homepage />} />
                    <Route path="/schedule" element={<Timesheet />} />
                    <Route path="/login" element={<Homepage />} />
                    <Route path="/signup" element={<Homepage />} />
                </Routes>
            )}
        </>
    );
}

export default App;
