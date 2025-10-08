<?php
// backend/middleware/validation.php

function validate_student_input($data, $isUpdate = false) {
    $errors = [];

    if (empty(trim($data['full_name'] ?? '')))
        $errors['full_name'] = 'Full name required';

    if (!$isUpdate && empty(trim($data['student_id'] ?? '')))
        $errors['student_id'] = 'Student ID required';

    if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL))
        $errors['email'] = 'Invalid email';

    if (empty($data['dob']) || !strtotime($data['dob']))
        $errors['dob'] = 'Invalid date of birth';

    if (empty($data['enrollment_date']) || !strtotime($data['enrollment_date']))
        $errors['enrollment_date'] = 'Invalid enrollment date';

    return $errors;
}
