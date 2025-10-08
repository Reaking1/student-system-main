-- Create DB
CREATE DATABASE IF NOT EXISTS uni_sis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uni_sis;

-- Courses table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,      -- e.g. CS101, BCOM-ENG
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Students table
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(30) NOT NULL UNIQUE, -- human-readable ID
  email VARCHAR(255) NOT NULL UNIQUE,
  dob DATE NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE NOT NULL,
  status ENUM('ACTIVE','PENDING','INACTIVE','GRADUATED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_student_name (full_name),
  INDEX idx_student_email (email),
  INDEX idx_course (course_id)
) ENGINE=InnoDB;

-- Users table (for admin and student login)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','student') NOT NULL DEFAULT 'student',
  student_id INT NULL, -- if role='student', link to students.id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Deletion logs table (structured)
CREATE TABLE deletion_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_pk VARCHAR(255) NOT NULL,
  deleted_by VARCHAR(255) NULL, -- username or user id
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data JSON NULL,               -- JSON snapshot of deleted row
  INDEX (table_name),
  INDEX (deleted_by)
) ENGINE=InnoDB;

INSERT INTO courses (code, name, description) VALUES
('BSC-CS', 'BSc Computer Science', 'Bachelor of Science in Computer Science'),
('BCOM', 'Bachelor of Commerce', 'Commerce degree'),
('BENG', 'Bachelor of Engineering', 'Engineering degree');
