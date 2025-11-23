<?php
// api/config.php
header('Content-Type: application/json; charset=utf-8');

$DB_HOST = 'localhost';
$DB_NAME = 'anime_portal';
$DB_USER = 'anime_user';
$DB_PASS = 'GANTI_DENGAN_PASSWORD_DB';

// Buat koneksi PDO ke MySQL
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection error']);
    exit;
}

function json_input()
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function send_json($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}