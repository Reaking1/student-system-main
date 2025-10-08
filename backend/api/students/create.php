<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true) ?? [];

$errors = validate_student_input($data);
if (!empty($errors)) {
    echo json_encode(['status'=>'error','errors'=>$errors]);
    exit;
}

$sql = "INSERT INTO students (full_name, student_id, email, dob, course_id, enrollment_date, status)
        VALUES (:full_name, :student_id, :email, :dob, :course_id, :enrollment_date, 'ACTIVE')";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':full_name' => $data['full_name'],
    ':student_id' => $data['student_id'],
    ':email' => $data['email'],
    ':dob' => $data['dob'],
    ':course_id' => (int)$data['course_id'],
    ':enrollment_date' => $data['enrollment_date']
]);

echo json_encode(['status'=>'success','id'=>$pdo->lastInsertId()]);
