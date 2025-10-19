import React, { useState, useEffect } from "react";
import { updateStudent } from "../services/studentService";
import "./StudentEditForm.css";

const StudentEditForm = ({ student, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    full_name: "",
    student_id: "",
    email: "",
    date_of_birth: "",
    course_id: "",
    enrollment_date: "",
    status: "Active",
  });

  // 🔹 Load existing student data into form
  useEffect(() => {
    if (student) {
      setForm({
        full_name: student.full_name || "",
        student_id: student.student_id || "",
        email: student.email || "",
        date_of_birth: student.date_of_birth
          ? student.date_of_birth.slice(0, 10)
          : "",
        course_id: student.course_id || "",
        enrollment_date: student.enrollment_date
          ? student.enrollment_date.slice(0, 10)
          : "",
        status: student.status || "Active",
      });
    }
  }, [student]);

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.full_name || !form.email || !form.course_id) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await updateStudent(student.id, form);

      if (response.status === "success") {
        alert("✅ Student updated successfully!");
        onUpdate({ ...student, ...form });
        onClose();
      } else {
        alert(response.message || "Failed to update student.");
      }
    } catch (error) {
      console.error("❌ Server error while updating student:", error);
      alert(error.message || "Server error while updating student.");
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

        <label>Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
        />

        <label>Enrollment Date:</label>
        <input
          type="date"
          name="enrollment_date"
          value={form.enrollment_date}
          onChange={handleChange}
        />

        <label>Status:</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditForm;
