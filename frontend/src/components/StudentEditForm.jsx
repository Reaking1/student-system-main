// src/components/StudentEditForm.jsx
import React, { useState, useEffect } from "react";
import "./StudentEditForm.css";

const StudentEditForm = ({ student, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    course_id: "",
    enrollment_date: "",
    status: "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        full_name: student.full_name || "",
        email: student.email || "",
        course_id: student.course_id || "",
        enrollment_date: student.enrollment_date || "",
        status: student.status || "Active",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost/student-system-main/backend/api/students/update.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.id, ...form }),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Student updated successfully!");
        onUpdate({ ...student, ...form });
        onClose();
      } else {
        alert(data.message || "Failed to update student");
      }
    } catch (err) {
    console.log(err.message("Server error while updating student"))
    }
  };

  return (
    <div className="edit-form">
      <h3>Edit Student</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="course_id"
          value={form.course_id}
          onChange={handleChange}
          placeholder="Course ID"
          required
        />
        <input
          type="date"
          name="enrollment_date"
          value={form.enrollment_date}
          onChange={handleChange}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditForm;
