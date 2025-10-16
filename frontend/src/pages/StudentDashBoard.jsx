import React, { useEffect, useState } from "react";
import { getStoredAuth } from "../services/authService";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getStoredAuth();
  const studentId = auth?.user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost/student-system-main/backend/api/reports/profile_report.php?id=${studentId}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const data = await res.json();
        if(data.status === "success") setStudent(data.student);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  const downloadPDF = async (reportType) => {
    if(reportType === "profile"){
      window.open(`http://localhost/student-system-main/backend/api/reports/profile_report.php?id=${studentId}`);
    } else if(reportType === "registration"){
      window.open(`http://localhost/student-system-main/backend/api/reports/registration_slip.php?id=${studentId}`);
    }
  };

  if(loading) return <p>Loading your reports...</p>;
  if(!student) return <p>No student data found.</p>;

  return (
    <div className="student-dashboard">
      <h1>Welcome, {student.full_name}</h1>

      <section className="report-section">
        <h2>Profile Summary</h2>
        <p><strong>ID:</strong> {student.student_id}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>DOB:</strong> {student.dob}</p>
        <p><strong>Course:</strong> {student.course_id}</p>
        <p><strong>Enrollment:</strong> {student.enrollment_date}</p>
        <button onClick={() => downloadPDF("profile")}>Download PDF</button>
      </section>

      <section className="report-section">
        <h2>Registration Confirmation Slip</h2>
        <p><strong>Registered:</strong> {student.created_at}</p>
        <p><strong>Course:</strong> {student.course_id}</p>
        <p><strong>Status:</strong> {student.status}</p>
        <button onClick={() => downloadPDF("registration")}>Download PDF</button>
      </section>
    </div>
  );
};

export default StudentDashboard;
