<?php
// backend/api/auth/register_student.php

require_once __DIR__ . '/../../config/cors.php';
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php';

// Read JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// --- Validate input ---
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$full_name = trim($data['full_name'] ?? '');
$email = trim($data['email'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username and password are required']);
    exit;
}

try {
    // --- Check if username already exists ---
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
        exit;
    }

    // --- Create student record ---
    $stmt = $pdo->prepare("
        INSERT INTO students (full_name, email, created_at)
        VALUES (:full_name, :email, NOW())
    ");
    $stmt->execute([
        ':full_name' => $full_name ?: $username,
        ':email' => $email
    ]);
    $student_id = $pdo->lastInsertId();

    // --- Hash password securely ---
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // --- Create user login record ---
    $stmt = $pdo->prepare("
        INSERT INTO users (username, password, role, student_id)
        VALUES (:username, :password, 'student', :student_id)
    ");
    $stmt->execute([
        ':username' => $username,
        ':password' => $hashedPassword,
        ':student_id' => $student_id
    ]);

    // --- Success response ---
    echo json_encode([
        'status' => 'success',
        'message' => 'Student account created successfully',
        'user' => [
            'username' => $username,
            'role' => 'student'
        ]
    ]);

} catch (Exception $e) {
    error_log("Register student error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error while registering student'
    ]);
}
