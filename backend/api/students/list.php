<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$search = $_GET['search'] ?? '';
$sql = "SELECT s.*, c.code as course_code, c.name as course_name
        FROM students s
        JOIN courses c ON s.course_id = c.id
        WHERE s.full_name LIKE :q OR s.student_id LIKE :q OR s.email LIKE :q
        ORDER BY s.full_name ASC
        LIMIT 100";
$stmt = $pdo->prepare($sql);
$stmt->execute([':q' => "%$search%"]);

echo json_encode($stmt->fetchAll());
