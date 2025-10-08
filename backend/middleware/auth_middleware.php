<?php
// backend/middleware/auth_middleware.php

require_once __DIR__ . '/../db.php';

function checkAuth($requireAdmin = false) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Missing token']);
        exit;
    }

    $token = $matches[1];

    // Validate token in sessions table
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT u.id, u.username, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = :token
        LIMIT 1
    ");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token']);
        exit;
    }

    // Optional: restrict to admin only
    if ($requireAdmin && $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Access denied: Admins only']);
        exit;
    }

    // Return user info for further use
    return $user;
}
