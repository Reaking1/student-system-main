import { getStoredAuth } from "./authService";

const API_URL = "http://localhost/student-system-main/backend/api/admins";

// Utility: Attach token if available
function getAuthHeader() {
  const auth = getStoredAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
}

// ----------------------
// GET all admins
// ----------------------
export async function getAllAdmins() {
  const res = await fetch(`${API_URL}/list.php`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to fetch admins");
  }
  return data.admins || [];
}

// ----------------------
// CREATE new admin
// ----------------------
export async function createAdmin(adminData) {
  const res = await fetch(`${API_URL}/create.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(adminData),
  });
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to create admin");
  }
  return data.admin;
}

// ----------------------
// UPDATE admin info
// ----------------------
export async function updateAdmin(adminId, adminData) {
  const res = await fetch(`${API_URL}/update.php`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id: adminId, ...adminData }),
  });
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to update admin");
  }
  return data.admin;
}

// ----------------------
// DELETE admin
// ----------------------
export async function deleteAdmin(adminId) {
  const res = await fetch(`${API_URL}/delete.php?id=${adminId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to delete admin");
  }
  return data;
}

// ----------------------
// GET single admin by ID (optional)
// ----------------------
export async function getAdminById(adminId) {
  const res = await fetch(`${API_URL}/get.php?id=${adminId}`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to fetch admin details");
  }
  return data.admin;
}
