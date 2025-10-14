// src/components/AdminEditForm.jsx
import React, { useState, useEffect } from "react";
import "./AdminEditForm.css";

const AdminEditForm = ({ admin, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (admin) {
      setForm({
        full_name: admin.full_name || "",
        email: admin.email || "",
        username: admin.username || "",
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost/student-system-main/backend/api/admins/update.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: admin.id, ...form }),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Admin updated successfully!");
        onUpdate({ ...admin, ...form });
        onClose();
      } else {
        alert(data.message || "Failed to update admin");
      }
    } catch (err) {
      alert("Server error while updating admin");
    }
  };

  return (
    <div className="edit-form">
      <h3>Edit Admin</h3>
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
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditForm;
