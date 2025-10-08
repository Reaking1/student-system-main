const API_URL = "http://localhost/student-system/backend/api/students";

// --- Get all students (Admin only) ---
export async function getAllStudents() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/list.php`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch students");

    return data.students;
  } catch (error) {
    console.error("getAllStudents error:", error);
    throw error;
  }
}

// --- Get single student by ID ---
export async function getStudentById(studentId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/profile.php?student_id=${studentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch student");

    return data.student;
  } catch (error) {
    console.error("getStudentById error:", error);
    throw error;
  }
}

// --- Register a new student ---
export async function registerStudent(studentData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to register student");

    return data;
  } catch (error) {
    console.error("registerStudent error:", error);
    throw error;
  }
}

// --- Update student information ---
export async function updateStudent(studentId, studentData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update.php?student_id=${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update student");

    return data;
  } catch (error) {
    console.error("updateStudent error:", error);
    throw error;
  }
}

// --- Delete student ---
export async function deleteStudent(studentId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/delete.php?student_id=${studentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete student");

    return data;
  } catch (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

// --- Generate profile report PDF ---
export async function downloadProfileReport(studentId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost/student-system/backend/api/reports/profile_report.php?student_id=${studentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to download PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Profile_${studentId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("downloadProfileReport error:", error);
    throw error;
  }
}
