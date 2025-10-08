// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">UniSIS</Link>

        <ul className="navbar-links">
          {user ? (
            <>
              {user.role === "admin" ? (
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
              ) : (
                <li><Link to="/student/dashboard">Dashboard</Link></li>
              )}
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
