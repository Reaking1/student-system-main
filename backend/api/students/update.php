<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int)($data['id'] ?? 0);

$errors = validate_student_input($data, $isUpdate=true);
if (!empty($errors)) {
    echo json_encode(['status'=>'error','errors'=>$errors]);
    exit;
}

$sql = "UPDATE students
        SET full_name=:full_name, email=:email, dob=:dob, course_id=:course_id,
            enrollment_date=:enrollment_date, status=:status
        WHERE id=:id";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':full_name' => $data['full_name'],
    ':email' => $data['email'],
    ':dob' => $data['dob'],
    ':course_id' => (int)$data['course_id'],
    ':enrollment_date' => $data['enrollment_date'],
    ':status' => $data['status'],
    ':id' => $id
]);

echo json_encode(['status'=>'success']);
