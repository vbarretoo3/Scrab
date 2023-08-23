import './style/App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/auth';
import Homepage from './pages/Homepage';
import Timesheet from './pages/Timesheet';
import DataFetcher from './components/DataFetcher';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
    const { currentUser } = useAuth();
    const [user, setUser] = useState();
    const [isDataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        if (currentUser) {
          setUser(currentUser.uid);
        } else {
          setUser(null);
        }
      }, [currentUser]);

    return (
        <>
            <div>
                {user && <DataFetcher userId={user} onDataLoaded={setDataLoaded} />}
            </div>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/solutions" element={<Homepage />} />
                    <Route path="/pricing" element={<Homepage />} />
                    <Route path="/resources" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {isDataLoaded && (
                        <Route path="/schedule" element={<Timesheet />} />
                     )}
                </Routes>
        </>
    );
}

export default App;
