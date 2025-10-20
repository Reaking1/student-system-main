<?php
// backend/api/reports/profile_data.php

require_once __DIR__ . '/../../config/cors.php';
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php';

// --- Get student_id from query (numeric id expected) ---
$student_id = $_GET['student_id'] ?? '';

if (empty($student_id) || !is_numeric($student_id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
    exit;
}

try {
    // --- Fetch student info with course ---
    $stmt = $pdo->prepare("
        SELECT 
            s.id AS id,
            s.student_id AS student_code,
            s.full_name,
            s.email,
            s.date_of_birth,
            s.course_id,
            s.enrollment_date,
            s.status,
            s.created_at,
            c.course_code,
            c.course_name
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        WHERE s.id = :student_id
        LIMIT 1
    ");
    $stmt->execute([':student_id' => $student_id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Student not found']);
        exit;
    }

    // --- Return JSON success ---
    echo json_encode([
        'status' => 'success',
        'student' => $student
    ]);

} catch (Exception $e) {
    error_log("Profile Data Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error while fetching student data'
    ]);
}
