<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
    exit;
}

// Fetch student details
$stmt = $pdo->prepare("
    SELECT s.id, s.full_name, s.student_id, s.email, s.date_of_birth, s.course_id, s.enrollment_date, s.status,
           u.id AS user_id, u.username
    FROM students s
    LEFT JOIN users u ON u.username = s.student_id -- assume username for student = student_id
    WHERE s.id = :id
");
$stmt->execute([':id' => $id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if ($student) {
    echo json_encode(['status' => 'success', 'student' => $student]);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Student not found']);
}
