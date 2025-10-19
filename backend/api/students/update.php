<?php
// backend/api/students/update.php

// Include CORS and database setup
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

// Disable direct HTML error output (to keep JSON responses clean)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Ensure the method is PUT
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed"
    ]);
    exit;
}

// --- Get student ID from query string ---
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// --- Read JSON body ---
$input = json_decode(file_get_contents("php://input"), true);

// --- Validate basic input ---
if (!$id || !$input) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing or invalid student data",
        "id_received" => $id,
        "input_received" => $input
    ]);
    exit;
}

// --- Map frontend fields for validation compatibility ---
if (isset($input['date_of_birth']) && !isset($input['dob'])) {
    $input['dob'] = $input['date_of_birth'];
}

// --- Run validation ---
$errors = validate_student_input($input, true);
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Validation failed",
        "errors" => $errors
    ]);
    exit;
}

// --- Proceed with update ---
try {
    $sql = "UPDATE students SET 
                full_name = :full_name,
                student_id = :student_id,
                email = :email,
                date_of_birth = :date_of_birth,
                course_id = :course_id,
                enrollment_date = :enrollment_date,
                status = :status
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":full_name" => trim($input["full_name"]),
        ":student_id" => trim($input["student_id"]),
        ":email" => trim($input["email"]),
        ":date_of_birth" => $input["date_of_birth"],
        ":course_id" => (int)$input["course_id"],
        ":enrollment_date" => $input["enrollment_date"],
        ":status" => $input["status"] ?? 'Active',
        ":id" => $id
    ]);

    // --- Success ---
    echo json_encode([
        "status" => "success",
        "message" => "Student updated successfully",
        "updated_id" => $id
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to update student",
        "error" => $e->getMessage()
    ]);
}
