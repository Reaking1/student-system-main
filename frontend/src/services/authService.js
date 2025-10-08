const API_URL = "http://localhost/student-system/backend/api/auth";

// authService.js
export async function login(username, password) {
  const res = await fetch("http://localhost/student-system/backend/api/auth/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  });

  const data = await res.json();
  if (data.status === "success") {
    // 🔑 Save auth state
    localStorage.setItem("auth", JSON.stringify(data));
  }
  return data;
}

export function logout() {
  localStorage.removeItem("auth");
  return fetch("http://localhost/student-system/backend/api/auth/logout.php", {
    method: "POST",
    credentials: "include"
  });
}

export function getStoredAuth() {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
}