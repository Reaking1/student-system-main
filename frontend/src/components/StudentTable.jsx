// src/components/StudentTable.jsx
import React from "react";
import "./StudentTable.css";

const StudentTable = ({ students, onDelete, onSelectStudent }) => {
  if (!students || students.length === 0) {
    return <p>No students found.</p>;
  }

  return (
    <div className="student-table">
      <h2>Students</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="clickable-row"
              onClick={() => onSelectStudent && onSelectStudent(student)} // ✅ now connects with AdminDashboard
            >
              <td>{student.id}</td>
              <td>{student.student_id}</td>
              <td>{student.full_name}</td>
              <td>{student.email}</td>
              <td>{student.course_id}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting when deleting
                    window.open(
                      `http://localhost/student-system-main/backend/api/reports/profile_report.php?student_id=${student.id}`,
                      "_blank"
                    );
                  }}
                >
                  Report
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(student.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
