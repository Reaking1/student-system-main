<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$id = (int)($_POST['id'] ?? 0);

// fetch snapshot
$stmt = $pdo->prepare("SELECT * FROM students WHERE id=:id");
$stmt->execute([':id' => $id]);
$student = $stmt->fetch();

if (!$student) {
    echo json_encode(['status'=>'error','message'=>'Student not found']);
    exit;
}

// log to file
$logLine = date('c') . " | Deleted student {$id} | " . json_encode($student) . PHP_EOL;
file_put_contents(__DIR__ . '/../../deletions.log', $logLine, FILE_APPEND | LOCK_EX);

// delete
$stmt = $pdo->prepare("DELETE FROM students WHERE id=:id");
$stmt->execute([':id'=>$id]);

echo json_encode(['status'=>'success']);
