<?php
// backend/index.php

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Registration System API</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; padding: 20px; }
        h1 { color: #333; }
        a { text-decoration: none; color: #007bff; }
        a:hover { text-decoration: underline; }
        ul { list-style: none; padding-left: 0; }
        li { margin-bottom: 10px; }
        .section { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Student Registration System API</h1>
    
    <div class="section">
        <h2>Auth</h2>
        <ul>
            <li><a href="api/auth/register_admin.php">Register Admin</a> (POST JSON)</li>
            <li><a href="api/auth/login.php">Login</a> (POST JSON)</li>
        </ul>
    </div>

    <div class="section">
        <h2>Students</h2>
        <ul>
            <li><a href="api/students/create.php">Create Student</a> (POST JSON)</li>
            <li><a href="api/students/list.php">List Students</a> (GET)</li>
            <li><a href="api/students/get.php?id=1">Get Student</a> (GET with ID)</li>
            <li><a href="api/students/update.php">Update Student</a> (POST JSON)</li>
            <li><a href="api/students/delete.php">Delete Student</a> (POST JSON)</li>
        </ul>
    </div>

    <div class="section">
        <h2>Reports</h2>
        <ul>
            <li><a href="api/reports/profile_report.php?student_id=1">Profile Report</a> (GET)</li>
            <li><a href="api/reports/registration_slip.php?student_id=1">Registration Slip</a> (GET)</li>
        </ul>
    </div>

    <p>Use a tool like Postman or your frontend React app to POST/GET JSON data to these endpoints.</p>
</body>
</html>
