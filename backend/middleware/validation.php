<?php
// backend/middleware/validation.php

function validate_student_input($data, $isUpdate = false) {
    $errors = [];

    // Full name required
    if (empty(trim($data['full_name'] ?? ''))) {
        $errors['full_name'] = 'Full name is required';
    }

    // Student ID required for create
    if (!$isUpdate && empty(trim($data['student_id'] ?? ''))) {
        $errors['student_id'] = 'Student ID is required';
    }

    // Email validation
    if (empty(trim($data['email'] ?? '')) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid or missing email';
    }

    // Date of birth validation
    if (empty($data['dob']) || !strtotime($data['dob'])) {
        $errors['dob'] = 'Invalid date of birth';
    }

    // Enrollment date validation
    if (empty($data['enrollment_date']) || !strtotime($data['enrollment_date'])) {
        $errors['enrollment_date'] = 'Invalid enrollment date';
    }

    // Course ID validation (must be a positive integer)
    if (empty($data['course_id']) || !filter_var($data['course_id'], FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
        $errors['course_id'] = 'Invalid course selected';
    }

    return $errors;
}
