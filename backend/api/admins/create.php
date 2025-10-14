<?php
// backend/api/admins/create.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$role = trim($data['role'] ?? 'admin');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Username and password are required']);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO admins (username, password, role, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$username, $hash, $role]);
    echo json_encode(['status'=>'success','message'=>'Admin created successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
