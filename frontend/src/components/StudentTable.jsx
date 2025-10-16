// src/components/StudentTable.jsx
import React from "react";
import { deleteStudent } from "../services/studentService";
import "./StudentTable.css";

const StudentTable = ({ students = [], onEditStudent, onDelete, onSelectStudent }) => {

  if (!students || students.length === 0) return <p>No students found.</p>;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      if (onDelete) onDelete(id); // notify parent
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="student-table">
      <h3>Students</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Course ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => 
            student ? (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.course_id}</td>
                <td>
                  {/* Trigger edit form */}
                  <button onClick={() => onEditStudent(student)}>Edit</button>
                  {/* Trigger delete */}
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                  {/* Optional: select to view profile */}
                  <button onClick={() => onSelectStudent(student)}>View</button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
