<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Get student ID from input (POST or JSON)
$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? $_POST['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid student ID']);
    exit;
}

// Fetch student record for logging
$stmt = $pdo->prepare("SELECT * FROM students WHERE id=:id");
$stmt->execute([':id' => $id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Student not found']);
    exit;
}

// Log deleted record
$logFile = __DIR__ . '/../../deletions.log';
$logLine = date('c') . " | Deleted student ID {$id} | " . json_encode($student) . PHP_EOL;
file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

// Delete student
$stmt = $pdo->prepare("DELETE FROM students WHERE id=:id");
try {
    $stmt->execute([':id' => $id]);
    echo json_encode(['status'=>'success','message'=>'Student deleted successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'=>'error',
        'message'=>'Failed to delete student',
        'error'=>$e->getMessage()
    ]);
}
