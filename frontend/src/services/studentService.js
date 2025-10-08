import { getStoredAuth } from "./authService";

const API_URL = "http://localhost/student-system/backend/api/students";

function getAuthHeader() {
  const auth = getStoredAuth();
  return auth?.token ? { "Authorization": `Bearer ${auth.token}` } : {};
}

// --- Get all students (Admin only) ---
export async function getAllStudents() {
  const res = await fetch(`${API_URL}/list.php`, {
    headers: getAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch students");
  return data.students || [];
}

// --- Get single student by ID ---
export async function getStudentById(studentId) {
  const res = await fetch(`${API_URL}/get.php?id=${studentId}`, {
    headers: getAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch student");
  return data;
}

// --- Register a new student ---
export async function registerStudent(studentData) {
  const res = await fetch(`${API_URL}/create.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(studentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to register student");
  return data;
}

// --- Update student information ---
export async function updateStudent(studentId, studentData) {
  const res = await fetch(`${API_URL}/update.php`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ id: studentId, ...studentData })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update student");
  return data;
}

// --- Delete student ---
export async function deleteStudent(studentId) {
  const res = await fetch(`${API_URL}/delete.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ id: studentId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete student");
  return data;
}

// --- Download profile report PDF ---
export async function downloadProfileReport(studentId) {
  const res = await fetch(`http://localhost/student-system/backend/api/reports/profile_report.php?id=${studentId}`, {
    headers: getAuthHeader()
  });

  if (!res.ok) throw new Error("Failed to download PDF");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Profile_${studentId}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
