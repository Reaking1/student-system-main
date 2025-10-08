<?php
// backend/api/auth/register_admin.php

header("Content-Type: application/json");

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// Basic validation
if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Username and password required']);
    exit;
}

// Optional: enforce minimum password length
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Password must be at least 6 characters long']);
    exit;
}

// Check if username already exists
$stmt = $pdo->prepare("SELECT id FROM admins WHERE username = :username");
$stmt->execute([':username' => $username]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status'=>'error','message'=>'Username already exists']);
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new admin
$stmt = $pdo->prepare("INSERT INTO admins (username, password) VALUES (:username, :password)");
$success = $stmt->execute([
    ':username' => $username,
    ':password' => $hashedPassword
]);

if ($success) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Admin registered successfully',
        'admin' => [
            'id' => $pdo->lastInsertId(),
            'username' => $username
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Failed to register admin']);
}
