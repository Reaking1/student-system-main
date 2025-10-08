import React, { useState, } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export default function LoginForm() {
  const { login, loading} = useAuth();
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔥 Redirect if already logged in (page refresh case)
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedInUser = await login(username, password);

      // Redirect after login
      navigate(
        loggedInUser.role === "admin" ? "/admin/dashboard" : "/student/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Login failed"); 
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
