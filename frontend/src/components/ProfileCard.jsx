import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ student }) => {
  if (!student) return <p>No profile data available.</p>;

  // ✅ Pass numeric student.id (not student.student_id)
  const reportLink = `http://localhost/student-system-main/backend/api/reports/profile_report.php?student_id=${student.id}`;

  return (
    <div className="profile-card">
      <h2>Student Profile</h2>
      <div className="profile-info">
        <p><strong>Full Name:</strong> {student.full_name}</p>
        <p><strong>Student ID:</strong> {student.student_id}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Date of Birth:</strong> {student.date_of_birth}</p>
        <p><strong>Course:</strong> {student.course_id}</p>
        <p><strong>Enrollment Date:</strong> {student.enrollment_date}</p>
        <p><strong>Status:</strong> {student.status}</p>
      </div>

      <div className="profile-actions">
        <button onClick={() => window.open(reportLink, "_blank")}>
          Download Profile Report
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
