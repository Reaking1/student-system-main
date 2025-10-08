// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import { getAllStudents } from "../services/studentService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading students...</p>
      ) : (
       <StudentTable
  students={students}
  onDelete={(id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }
  onUpdate={(updatedStudent) =>
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    )
  }
/>

      )}

      <div className="form-section">
        <h2>Add New Student</h2>
        <StudentForm
          onStudentAdded={(newStudent) =>
            setStudents((prev) => [...prev, newStudent])
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
