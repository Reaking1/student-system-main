// src/pages/StudentProfile.jsx
import React from "react";
import ProfileCard from "../components/ProfileCard";
import "./StudentProfile.css";

const StudentProfile = ({ student }) => {
  if (!student) {
    return (
      <div className="student-profile">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="student-profile">
      <ProfileCard student={student} />
    </div>
  );
};

export default StudentProfile;
