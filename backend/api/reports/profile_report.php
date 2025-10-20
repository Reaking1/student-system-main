<?php
// backend/api/reports/profile_report.php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../lib/fpdf.php';

// Ensure we output valid JSON in case of error
header('Content-Type: application/json');

// --- Get numeric student_id (the database "id") ---
$student_id = trim($_GET['student_id'] ?? '');

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

    // --- Prepare PDF ---
    $pdf = new FPDF();
    $pdf->AddPage();

    // Title
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Student Profile Summary', 0, 1, 'C');
    $pdf->Ln(8);

    // Personal Info
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(50, 8, 'Full Name:', 0, 0);
    $pdf->Cell(0, 8, $student['full_name'], 0, 1);

    $pdf->Cell(50, 8, 'Student Code:', 0, 0);
    $pdf->Cell(0, 8, $student['student_code'], 0, 1);

    $pdf->Cell(50, 8, 'Email:', 0, 0);
    $pdf->Cell(0, 8, $student['email'], 0, 1);

    $pdf->Cell(50, 8, 'Date of Birth:', 0, 0);
    $pdf->Cell(0, 8, $student['date_of_birth'], 0, 1);

    $pdf->Ln(5);

    // Academic Info
    $pdf->Cell(50, 8, 'Course:', 0, 0);
    $pdf->Cell(0, 8, ($student['course_code'] ?? 'N/A') . ' - ' . ($student['course_name'] ?? 'N/A'), 0, 1);

    $pdf->Cell(50, 8, 'Enrollment Date:', 0, 0);
    $pdf->Cell(0, 8, $student['enrollment_date'], 0, 1);

    $pdf->Cell(50, 8, 'Status:', 0, 0);
    $pdf->Cell(0, 8, $student['status'], 0, 1);

    // --- Output the PDF inline ---
    header('Content-Type: application/pdf');
    $pdf->Output('I', "Profile_{$student['student_code']}.pdf");

} catch (Exception $e) {
    error_log("Profile Report Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error while generating PDF report'
    ]);
}
