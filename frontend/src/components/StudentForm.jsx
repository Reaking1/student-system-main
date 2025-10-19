import { useState } from "react";
import { registerStudent } from "../services/studentService";
import "./StudentForm.css";

const StudentForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    full_name: "",
    student_id: "",
    email: "",
    date_of_birth: "",
    course_id: "",
    enrollment_date: new Date().toISOString().split("T")[0], // default today
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send the form data to the backend
      const data = await registerStudent(form);

      if (data.status === "success") {
        alert("Student created successfully!");
        // Reset form
        setForm({
          full_name: "",
          student_id: "",
          email: "",
          date_of_birth: "",
          course_id: "",
          enrollment_date: new Date().toISOString().split("T")[0],
        });
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || "Failed to create student");
      }
    } catch (err) {
      console.error("Error creating student:", err);
      setError(err.message || "Server error while creating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-form">
      <h2>Add Student</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Student ID
          <input
            type="text"
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Course ID
          <input
            type="number"
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Enrollment Date
          <input
            type="date"
            name="enrollment_date"
            value={form.enrollment_date}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
