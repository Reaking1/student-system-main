// src/components/AdminTable.jsx
import React, { useEffect, useState } from "react";
import "./AdminTable.css";

const AdminTable = ({ onSelectAdmin }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost/student-system/backend/api/admins/list.php");
      const data = await res.json();
      if (data.status === "success") setAdmins(data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await fetch(`http://localhost/student-system-main/backend/api/admins/delete.php?id=${id}`, {
        method: "DELETE",
      });
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) return <p>Loading admins...</p>;

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
          {admins.map((admin) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
