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

  const data = await res.json();

  if (data.status === "success" && data.token) {
    // Save token + user info in localStorage
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: data.token,
        user: data.user
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
