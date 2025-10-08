<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../middleware/validation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Validate student input
$errors = validate_student_input($data);
if (!empty($errors)) {
    echo json_encode(['status'=>'error','errors'=>$errors]);
    exit;
}

// 1️⃣ Insert into students table
$sql = "INSERT INTO students 
        (full_name, student_id, email, date_of_birth, course_id, enrollment_date, status)
        VALUES (:full_name, :student_id, :email, :dob, :course_id, :enrollment_date, 'Active')";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':full_name' => $data['full_name'],
    ':student_id' => $data['student_id'],
    ':email' => $data['email'],
    ':dob' => $data['dob'],
    ':course_id' => (int)$data['course_id'],
    ':enrollment_date' => $data['enrollment_date']
]);

$studentId = $pdo->lastInsertId();

// 2️⃣ Insert into users table for login
$defaultPassword = password_hash('changeme123', PASSWORD_BCRYPT); // or generate dynamically
$stmtUser = $pdo->prepare("INSERT INTO users (username, password, role, student_id) 
                           VALUES (:username, :password, 'student', :student_id)");
$stmtUser->execute([
    ':username' => $data['student_id'], // or email/username field
    ':password' => $defaultPassword,
    ':student_id' => $studentId
]);

echo json_encode([
    'status' => 'success',
    'student_id' => $studentId,
    'message' => 'Student created and login account generated.'
]);
