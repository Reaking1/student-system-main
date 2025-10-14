// src/components/AdminForm.jsx
import React, { useState } from "react";
import "./AdminForm.css";

const AdminForm = ({ onAdminAdded }) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/student-system-main/backend/api/admins/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Admin added successfully");
        onAdminAdded(data.admin);
        setForm({ full_name: "", email: "", username: "", password: "" });
      } else {
        alert(data.message || "Failed to add admin");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add New Admin</h3>
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={form.full_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Admin</button>
    </form>
  );
};

export default AdminForm;
