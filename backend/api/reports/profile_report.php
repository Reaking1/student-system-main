<?php
// backend/api/reports/profile_report.php

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../lib/fpdf.php';

header('Content-Type: application/json'); // fallback for error

$student_id = (int)($_GET['student_id'] ?? 0);

if ($student_id <= 0) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid student ID']);
    exit;
}

// Fetch student + course
$stmt = $pdo->prepare("
    SELECT s.*, c.code AS course_code, c.name AS course_name
    FROM students s
    JOIN courses c ON s.course_id = c.id
    WHERE s.id=:id
");
$stmt->execute([':id' => $student_id]);
$student = $stmt->fetch();

if (!$student) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Student not found']);
    exit;
}

// Generate PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'Student Profile Summary',0,1,'C');
$pdf->Ln(5);

// Personal Details
$pdf->SetFont('Arial','',12);
$pdf->Cell(50,8,'Full Name:',0,0);
$pdf->Cell(0,8,$student['full_name'],0,1);

$pdf->Cell(50,8,'Student ID:',0,0);
$pdf->Cell(0,8,$student['student_id'],0,1);

$pdf->Cell(50,8,'Email:',0,0);
$pdf->Cell(0,8,$student['email'],0,1);

$pdf->Cell(50,8,'Date of Birth:',0,0);
$pdf->Cell(0,8,$student['dob'],0,1);

$pdf->Ln(5);

// Academic Info
$pdf->Cell(50,8,'Course of Study:',0,0);
$pdf->Cell(0,8,$student['course_code'] . ' - ' . $student['course_name'],0,1);

$pdf->Cell(50,8,'Enrollment Date:',0,0);
$pdf->Cell(0,8,$student['enrollment_date'],0,1);

$pdf->Cell(50,8,'Status:',0,0);
$pdf->Cell(0,8,$student['status'],0,1);

// Output PDF
$pdf->Output('I', "Profile_{$student['student_id']}.pdf"); // 'I' = inline browser display
