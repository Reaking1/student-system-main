import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import Reports from "./pages/Reports";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth(); // get logged-in user

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Student routes */}
        <Route
          path="/student/profile"
          element={
            user && user.role === "student" ? (
              <StudentProfile student={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student/reports"
          element={
            user && user.role === "student" ? (
              <Reports student={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin/dashboard"
                    : "/student/profile"
                  : "/login"
              }
            />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
