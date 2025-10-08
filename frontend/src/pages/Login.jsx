// src/pages/Login.jsx
import React from "react";
import LoginForm from "../components/loginForm";
import './login.css'



const Login = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <LoginForm />
        <p className="footer">© {new Date().getFullYear()} Student Management System</p>
      </div>
    </div>
  );
};

export default Login;
