import { getStoredAuth } from "./authService";

const API_URL = "http://localhost/student-system-main/backend/api/students";

// --------------------------
// AUTH HEADER HANDLER
// --------------------------
function getAuthHeader() {
  const auth = getStoredAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
}

// --------------------------
// GET ALL STUDENTS (Admin only)
// --------------------------
export async function getAllStudents() {
  const res = await fetch(`${API_URL}/list.php`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to fetch students");
  }

  return data.students || [];
}

// --------------------------
// GET SINGLE STUDENT BY ID
// --------------------------
export async function getStudentById(studentId) {
  const res = await fetch(`${API_URL}/get.php?id=${studentId}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to fetch student");
  }

  return data.student || data;
}

// --------------------------
// REGISTER NEW STUDENT
// --------------------------
// --------------------------
// REGISTER NEW STUDENT
// --------------------------
export async function registerStudent(studentData) {
  const response = await fetch(
    "http://localhost/student-system-main/backend/api/students/create.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    }
  );

  let data;
  try {
    data = await response.json(); // parse JSON response
  } catch {
    throw new Error("Invalid JSON response from server (check PHP errors)");
  }

  if (!response.ok || data.status !== "success") {
    const errorMessage = data?.message || "Validation failed";
    throw new Error(errorMessage);
  }

  return data;
}




// --------------------------
// UPDATE STUDENT
// --------------------------
export async function updateStudent(studentId, studentData) {
  // 🔹 Only send what backend expects (matches update.php)
  const payload = {
    full_name: studentData.full_name,
    student_id: studentData.student_id,
    email: studentData.email,
    date_of_birth: studentData.date_of_birth, // backend expects this key
    course_id: studentData.course_id,
    enrollment_date: studentData.enrollment_date,
    status: studentData.status || "Active",
  };

  const res = await fetch(`${API_URL}/update.php?id=${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server (check PHP errors)");
  }

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to update student");
  }

  return data;
}

// --------------------------
// DELETE STUDENT
// --------------------------
export async function deleteStudent(studentId) {
  const res = await fetch(`${API_URL}/delete.php`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id: studentId }),
  });

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Failed to delete student");
  }

  return data;
}

// --------------------------
// DOWNLOAD PROFILE REPORT (PDF)
// --------------------------
export async function downloadProfileReport(studentId) {
  const res = await fetch(
    `${API_URL.replace("/students", "")}/reports/profile_report.php?id=${studentId}`,
    {
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) throw new Error("Failed to download PDF");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Profile_${studentId}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
