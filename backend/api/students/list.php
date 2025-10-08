<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {
    // Fetch all students with optional login info
    $stmt = $pdo->query("
        SELECT s.id, s.full_name, s.student_id, s.email, s.date_of_birth, s.course_id, 
               s.enrollment_date, s.status,
               u.id AS user_id, u.username
        FROM students s
        LEFT JOIN users u ON u.username = s.student_id
        ORDER BY s.full_name ASC
    ");
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'students' => $students
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch students',
        'error' => $e->getMessage()
    ]);
}
