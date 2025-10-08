<?php
// backend/api/auth/login.php

require_once __DIR__ . '/../../config/cors.php'; // CORS headers first
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

// Get input data
$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// Validate input
if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username and password are required']);
    exit;
}

// Fetch user from DB
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    exit;
}

// Optional: allow only admin login
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied: not an admin']);
    exit;
}

// Generate a simple token
$token = base64_encode(random_bytes(32));

// Store token in sessions table
$stmt = $pdo->prepare("INSERT INTO sessions (user_id, token) VALUES (:user_id, :token)");
$stmt->execute([
    ':user_id' => $user['id'],
    ':token' => $token
]);

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Login successful',
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role']
    ]
]);
