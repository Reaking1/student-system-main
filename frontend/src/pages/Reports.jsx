import React from "react";
import "./Reports.css";

const Reports = ({ student }) => {
  if (!student) {
    return <p>No student data available. Please log in.</p>;
  }

  // ✅ Corrected the backend path to match your folder structure
  const baseUrl = "http://localhost/student-system-main/backend/api/reports";

  const profileReportUrl = `${baseUrl}/profile_report.php?student_id=${student.id}`;
  const registrationSlipUrl = `${baseUrl}/registration_slip.php?student_id=${student.id}`;

  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <p>Download your academic reports below:</p>

      <div className="report-links">
        <a href={profileReportUrl} target="_blank" rel="noopener noreferrer">
          Download Profile Report
        </a>
        <a href={registrationSlipUrl} target="_blank" rel="noopener noreferrer">
          Download Registration Slip
        </a>
      </div>
    </div>
  );
};

export default Reports;
