<?php
// backend/api/admins/delete.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid admin ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM admins WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(['status'=>'success','message'=>'Admin deleted successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
