// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import ProfileCard from "../components/ProfileCard";
import AdminTable from "../components/AdminTable";
import AdminForm from "../components/AdminForm";
import AdminEditForm from "../components/AdminEditForm";
import StudentEditForm from "../components/StudentEditForm";
import { getAllStudents } from "../services/studentService";
import { getAllAdmins } from "../services/adminService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // --- Student Management ---
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // --- Admin Management ---
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------
  // Load all data (students + admins)
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, adminData] = await Promise.all([
          getAllStudents(),
          getAllAdmins(),
        ]);
        setStudents(studentData);
        setAdmins(adminData);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {/* ===================================================
          STUDENT MANAGEMENT SECTION
      =================================================== */}
      <section className="dashboard-section">
        <h2>Students</h2>

        <StudentTable
          students={students}
          onSelectStudent={(s) => setSelectedStudent(s)}
          onEditStudent={(s) => setEditingStudent(s)}
          onDelete={(id) => setStudents((prev) => prev.filter((s) => s.id !== id))}
          onUpdate={(updatedStudent) =>
            setStudents((prev) =>
              prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
            )
          }
        />

        {selectedStudent && (
          <div className="profile-card-section">
            <ProfileCard student={selectedStudent} />
          </div>
        )}

        <div className="form-section">
          <h3>Add New Student</h3>
          <StudentForm
            onStudentAdded={(newStudent) =>
              setStudents((prev) => [...prev, newStudent])
            }
          />
        </div>

        {editingStudent && (
          <StudentEditForm
            student={editingStudent}
            onUpdate={(updated) =>
              setStudents((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              )
            }
            onClose={() => setEditingStudent(null)}
          />
        )}
      </section>

      {/* ===================================================
          ADMIN MANAGEMENT SECTION
      =================================================== */}
      <section className="dashboard-section">
        <h2>Admin Accounts</h2>

     <AdminTable
  admins={admins}
  onSelectAdmin={(a) => setEditingAdmin(a)}
  onDelete={(id) =>
    setAdmins((prev) => prev.filter((a) => a.id !== id))
  }
/>


        <div className="form-section">
          <h3>Add New Admin</h3>
          <AdminForm
            onAdminAdded={(newAdmin) =>
              setAdmins((prev) => [...prev, newAdmin])
            }
          />
        </div>

        {editingAdmin && (
          <AdminEditForm
            admin={editingAdmin}
            onUpdate={(updated) =>
              setAdmins((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
              )
            }
            onClose={() => setEditingAdmin(null)}
          />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
