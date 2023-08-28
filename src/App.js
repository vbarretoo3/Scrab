import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/auth";
import Homepage from "./pages/Homepage";
import Timesheet from "./pages/Timesheet";
import DataFetcher from "./components/DataFetcher";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PublicHeader from "./components/PublicHeader";
import NavBar from "./components/NavBar";
import ProtectedHeader from "./components/ProtectedHeader";
import Dashboard from "./pages/Dashboard";
import Payroll from "./pages/Payroll";
import Staff from "./pages/Staff";
import Loading from "./components/Loading";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import { useLocation } from "react-router-dom";
import PickPlan from "./pages/PickPlan";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [dataLoaded, setDataLoaded] = React.useState(false);

  const isProtectedRoute = [
    "/staff",
    "/schedule",
    "/dashboard",
    "/payroll",
    "/settings",
  ].includes(location.pathname);

  // If it's still authenticating the user
  if (loading) return <Loading />;

  // If on a protected route but no currentUser, show loading (or you can redirect to login)
  if (isProtectedRoute && !currentUser) return <Loading />;

  return (
    <>
      {currentUser && !dataLoaded && (
        <DataFetcher
          userId={currentUser.uid}
          onDataLoaded={() => setDataLoaded(true)}
        />
      )}
      {isProtectedRoute ? <ProtectedHeader /> : <PublicHeader />}
      <div className={isProtectedRoute ? "protected-container" : "default"}>
        {isProtectedRoute && <NavBar />}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/plans" element={<PickPlan />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Timesheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
