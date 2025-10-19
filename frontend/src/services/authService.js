// src/services/authService.js

// --- Base URLs ---
const API_BASE_URL = "http://localhost/student-system-main/backend/api";
const AUTH_API_URL = `${API_BASE_URL}/auth`;

// --- LOGIN ---
export async function login(username, password) {
  const res = await fetch(`${AUTH_API_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Login parse error:", err);
    throw new Error("Invalid response from server — check backend PHP errors.");
  }

  // --- Handle login success ---
  if (data.status === "success") {
    const token = data.token || data.access_token || null;

    // --- Normalize role ---
    const role =
      data.user?.role?.toLowerCase() === "student"
        ? "student"
        : data.user?.role?.toLowerCase() === "admin"
        ? "admin"
        : "guest";

    // --- Store everything in localStorage ---
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token,
        user: {
          id: data.user?.id,
          username: data.user?.username,
          role,
          student_id: data.user?.student_id ?? null,
        },
      })
    );

    return { ...data, role };
  }

  // --- If login failed ---
  throw new Error(data.message || "Login failed");
}

// --- LOGOUT ---
export async function logout() {
  const auth = getStoredAuth();
  if (!auth?.token) {
    localStorage.removeItem("auth");
    return;
  }

  try {
    await fetch(`${AUTH_API_URL}/logout.php`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    });
  } catch (error) {
    console.warn(error.message("Logout request failed, but session cleared."));
  }

  localStorage.removeItem("auth");
}

// --- GET STORED AUTH ---
export function getStoredAuth() {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
}

// --- GET AUTH HEADER ---
export function getAuthHeader() {
  const auth = getStoredAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
}
