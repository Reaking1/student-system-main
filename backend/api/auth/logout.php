<?php
// backend/api/auth/logout.php
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$user = checkAuth(); // from auth_middleware.php, returns user info
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
$token = $matches[1] ?? '';

if ($token) {
    $stmt = $pdo->prepare("DELETE FROM sessions WHERE token = :token");
    $stmt->execute([':token' => $token]);
}

echo json_encode([
    'status' => 'success',
    'message' => 'Logged out successfully'
]);
