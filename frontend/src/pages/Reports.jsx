// src/pages/Reports.jsx
import React from "react";
import "./Reports.css";

const Reports = ({ student }) => {
  if (!student) {
    return <p>No student data available. Please log in.</p>;
  }

  const profileReportUrl = `http://localhost/student-system/backend/api/reports/profile_report.php?student_id=${student.id}`;
  const registrationSlipUrl = `http://localhost/student-system/backend/api/reports/registration_slip.php?student_id=${student.id}`;

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
