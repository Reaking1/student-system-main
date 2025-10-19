<?php
// backend/api/students/create.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

header('Content-Type: application/json; charset=UTF-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

// Decode JSON input
$input = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

// Default enrollment date if not provided
if (empty($input['enrollment_date'])) {
    $input['enrollment_date'] = date('Y-m-d');
}

// --- Map frontend fields for validation compatibility ---
if (isset($input['date_of_birth']) && !isset($input['dob'])) {
    $input['dob'] = $input['date_of_birth'];
}

// Validate input
$errors = validate_student_input($input);
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Validation failed",
        "errors" => $errors
    ]);
    exit;
}

try {
    // Insert into students table
    $stmt = $pdo->prepare("
        INSERT INTO students 
            (full_name, student_id, email, date_of_birth, course_id, enrollment_date, status)
        VALUES 
            (:full_name, :student_id, :email, :date_of_birth, :course_id, :enrollment_date, 'Active')
    ");
    $stmt->execute([
        ':full_name' => $input['full_name'],
        ':student_id' => $input['student_id'],
        ':email' => $input['email'],
        ':date_of_birth' => $input['date_of_birth'],
        ':course_id' => (int)$input['course_id'],
        ':enrollment_date' => $input['enrollment_date']
    ]);

    $studentId = $pdo->lastInsertId();

    // Create default login account
    $defaultPassword = password_hash('changeme123', PASSWORD_BCRYPT);

    $stmtUser = $pdo->prepare("
        INSERT INTO users (username, password, role, student_id)
        VALUES (:username, :password, 'student', :student_id)
    ");
    $stmtUser->execute([
        ':username' => $input['student_id'],
        ':password' => $defaultPassword,
        ':student_id' => $studentId
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Student created successfully",
        "student_id" => $studentId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error while creating student",
        "error" => $e->getMessage()
    ]);
}
