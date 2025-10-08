<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM students WHERE id = :id");
$stmt->execute([':id' => $id]);

$student = $stmt->fetch();
if ($student) {
    echo json_encode($student);
} else {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Student not found']);
}
