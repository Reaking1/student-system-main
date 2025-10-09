// src/services/authService.js

// Base URLs
const API_BASE_URL = "http://localhost/student-system-main/backend/api";
const AUTH_API_URL = `${API_BASE_URL}/auth`;

// --- LOGIN ---
export async function login(username, password) {
  const res = await fetch(`${AUTH_API_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  // In case backend throws PHP errors (HTML), guard parsing
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from server — check backend PHP errors.");
  }

  if (data.status === "success" && (data.token || data.access_token)) {
    // Normalize token field name
    const token = data.token || data.access_token;

    // Save token + user info
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token,
        user: data.user || null
      })
    );
  }

  return data;
}

// --- LOGOUT ---
export async function logout() {
  const auth = getStoredAuth();
  if (!auth?.token) return;

  await fetch(`${AUTH_API_URL}/logout.php`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${auth.token}`
    }
  });

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
  return auth?.token ? { "Authorization": `Bearer ${auth.token}` } : {};
}
