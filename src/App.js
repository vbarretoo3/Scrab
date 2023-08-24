import React from 'react';
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

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [dataLoaded, setDataLoaded] = React.useState(false);

  if (loading) {
    return (
      <>
        <PublicHeader />
        <h1>Loading...</h1>
      </>
    );
  }

  const isProtectedRoute = ["/staff", "/schedule", "/dashboard", "/payroll"].includes(location.pathname);

  return (
    <>
      {currentUser && <DataFetcher userId={currentUser.uid} onDataLoaded={() => setDataLoaded(true)} />}
      {isProtectedRoute ? <ProtectedHeader /> : <PublicHeader />}
      <div className={isProtectedRoute ? 'protected-container' : 'default'}>
        {isProtectedRoute && <NavBar />}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/schedule" element={
            <ProtectedRoute>
              <Timesheet />
            </ProtectedRoute>
          }/>

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

          <Route path="/payroll" element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }/>

          <Route path="/staff" element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </>
  );
}

export default App;
