import './style/App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import Homepage from './pages/Homepage';
import Timesheet from './pages/Timesheet';
import DataFetcher from './components/DataFetcher';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PublicHeader from './components/PublicHeader';
import NavBar from './components/NavBar';
import ProtectedHeader from './components/ProtectedHeader';
import { useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Payroll from './pages/Payroll';
import Staff from './pages/Staff';

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

    const location = useLocation();

    // Define the paths for protected routes
    const protectedRoutes = ["/staff", "/schedule", "/dashboard", "/payroll"];
  
    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.includes(location.pathname);
    

    return (
        <>
          <div>
              {user && <DataFetcher userId={user} onDataLoaded={setDataLoaded} />}
          </div>
          <div>
            {isProtectedRoute ? <ProtectedHeader /> : <PublicHeader />}
          <div className={isProtectedRoute? 'protected-container': 'default'}>
              {isProtectedRoute && <NavBar />}
              <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/solutions" element={<Homepage />} />
                  <Route path="/pricing" element={<Homepage />} />
                  <Route path="/resources" element={<Homepage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/schedule" element={isDataLoaded && currentUser? <Timesheet /> : <Navigate to={'/login'}/>} />
                  <Route path="/dashboard" element={isDataLoaded && currentUser? <Dashboard /> : <Navigate to={'/login'}/>} />
                  <Route path="/payroll" element={isDataLoaded && currentUser? <Payroll /> : <Navigate to={'/login'}/>} />
                  <Route path="/staff" element={isDataLoaded && currentUser? <Staff /> : <Navigate to={'/login'}/>} />
              </Routes>
            </div>
          </div>
        </>
    );
}

export default App;
