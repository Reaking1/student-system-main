<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

header('Content-Type: application/json');

// Get student ID from URL or input
$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid student ID']);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Validate input
$errors = validate_student_input($data, true); // true = update mode
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','errors'=>$errors]);
    exit;
}

// Build SQL to update student
$sql = "UPDATE students SET
            full_name = :full_name,
            student_id = :student_id,
            email = :email,
            date_of_birth = :dob,
            course_id = :course_id,
            enrollment_date = :enrollment_date,
            status = :status
        WHERE id = :id";

$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        ':full_name' => $data['full_name'],
        ':student_id' => $data['student_id'],
        ':email' => $data['email'],
        ':dob' => $data['dob'],
        ':course_id' => (int)$data['course_id'],
        ':enrollment_date' => $data['enrollment_date'],
        ':status' => $data['status'] ?? 'Active',
        ':id' => $id
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Student updated successfully'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to update student',
        'error' => $e->getMessage()
    ]);
}
