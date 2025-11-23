<?php
// api/auth.php
require __DIR__ . '/config.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Login
    $body = json_input();
    $username = isset($body['username']) ? trim($body['username']) : '';
    $password = isset($body['password']) ? $body['password'] : '';

    if ($username === '' || $password === '') {
        send_json(['error' => 'Username dan password wajib diisi.'], 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        send_json(['error' => 'Username atau password salah.'], 401);
    }

    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_username'] = $user['username'];

    send_json(['ok' => true]);
}

if ($method === 'GET') {
    // Cek status login
    $loggedIn = isset($_SESSION['admin_id']);
    send_json([
        'logged_in' => $loggedIn,
        'username' => $loggedIn ? $_SESSION['admin_username'] : null
    ]);
}

if ($method === 'DELETE') {
    // Logout
    session_destroy();
    send_json(['ok' => true]);
}

send_json(['error' => 'Method not allowed'], 405);