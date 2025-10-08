<?php
// backend/middleware/auth_middleware.php

function checkAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['status'=>'error','message'=>'Unauthorized']);
        exit;
    }

    $token = $matches[1];

    // TODO: validate token against DB or session store
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['status'=>'error','message'=>'Invalid token']);
        exit;
    }
}
