import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredAuth } from "../services/authService";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getStoredAuth();
  const studentId =  auth?.user?.student_id;



  // --- Protect route: only for logged-in students ---
  useEffect(() => {
    if (!auth || auth.user?.role !== "student") {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  // --- Fetch student profile ---
 useEffect(() => {
  const fetchProfile = async () => {
    try {
    if (!studentId) {
  console.error("Student ID is missing from auth object:", auth);
  return;
}


const res = await fetch(
  `http://localhost/student-system-main/backend/api/reports/profile_data.php?student_id=${studentId}`,
  { headers: { Authorization: `Bearer ${auth.token}` } }
);
      if (!res.ok) {
        console.error("Server responded with:", res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.status === "success") setStudent(data.student);
      else console.error("Backend error:", data.message);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [studentId, auth]);


  // --- Download PDF handler ---
  const downloadPDF = (reportType) => {
    if (!studentId) return;

    const base = "http://localhost/student-system-main/backend/api/reports";
    const url =
      reportType === "profile"
        ? `${base}/profile_report.php?student_id=${studentId}`
        : `${base}/registration_slip.php?student_id=${studentId}`;
    window.open(url, "_blank");
  };

  // --- UI States ---
  if (loading) return <p>Loading your reports...</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <div className="student-dashboard" style={styles.container}>
      <h1 style={styles.header}>🎓 Welcome, {student.full_name}</h1>

      {/* PROFILE SUMMARY REPORT */}
      <section style={styles.section}>
        <h2 style={styles.subHeader}>📘 Profile Summary Report</h2>
        <div style={styles.details}>
          <p><strong>ID:</strong> {student.student_id}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Date of Birth:</strong> {student.date_of_birth}</p>
          <p><strong>Course:</strong> {student.course_name || student.course_id}</p>
          <p><strong>Enrollment Date:</strong> {student.enrollment_date}</p>
        </div>
        <button style={styles.button} onClick={() => downloadPDF("profile")}>
          Download Profile PDF
        </button>
      </section>

      {/* REGISTRATION CONFIRMATION SLIP */}
      <section style={styles.section}>
        <h2 style={styles.subHeader}>📄 Registration Confirmation Slip</h2>
        <div style={styles.details}>
          <p><strong>Registered On:</strong> {student.created_at}</p>
          <p><strong>Course:</strong> {student.course_name || student.course_id}</p>
          <p><strong>Status:</strong> {student.status}</p>
        </div>
        <button style={styles.button} onClick={() => downloadPDF("registration")}>
          Download Registration Slip PDF
        </button>
      </section>
    </div>
  );
}

// --- Inline styles ---
const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f9f9ff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: { textAlign: "center", color: "#3a3a8f", marginBottom: "2rem" },
  subHeader: {
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: "0.5rem",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem 1.5rem",
    background: "#fff",
    borderRadius: "10px",
  },
  details: { lineHeight: "1.6" },
  button: {
    backgroundColor: "#3a3a8f",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};
