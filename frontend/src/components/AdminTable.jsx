// src/components/AdminTable.jsx
import React from "react";
import { deleteAdmin } from "../services/adminService";
import "./AdminTable.css";

const AdminTable = ({ admins = [], onSelectAdmin, onDelete }) => {
  // Handle deleting an admin
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await deleteAdmin(id);
      if (onDelete) onDelete(id); // notify parent to update state
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete admin");
    }
  };

  // If no admins, show message
  if (!admins.length) return <p>No admins found.</p>;

  return (
    <div className="admin-table">
      <h3>Admin Accounts</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) =>
            admin ? (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.full_name}</td>
                <td>{admin.email}</td>
                <td>{admin.username}</td>
                <td>
                  <button onClick={() => onSelectAdmin(admin)}>Edit</button>
                  <button onClick={() => handleDelete(admin.id)}>Delete</button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
