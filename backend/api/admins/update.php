<?php
// backend/api/admins/update.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = (int)($data['id'] ?? 0);
$username = trim($data['username'] ?? '');
$role = trim($data['role'] ?? '');
$password = trim($data['password'] ?? '');

if ($id <= 0 || $username === '') {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid admin data']);
    exit;
}

try {
    if ($password !== '') {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE admins SET username=?, password=?, role=? WHERE id=?");
        $stmt->execute([$username, $hash, $role, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE admins SET username=?, role=? WHERE id=?");
        $stmt->execute([$username, $role, $id]);
    }
    echo json_encode(['status'=>'success','message'=>'Admin updated successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
