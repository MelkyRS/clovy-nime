<?php
// api/anime.php
require __DIR__ . '/config.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];

function map_anime_row($row)
{
    $genres = [];
    if (!empty($row['genres'])) {
        $decoded = json_decode($row['genres'], true);
        if (is_array($decoded)) {
            $genres = $decoded;
        }
    }

    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'altTitle' => $row['alt_title'] ?? null,
        'type' => $row['type'] ?? null,
        'quality' => $row['quality'] ?? null,
        'section' => $row['section'] ?? null,
        'status' => $row['status'] ?? null,
        'score' => $row['score'] !== null ? floatval($row['score']) : null,
        'episodesAired' => $row['episodes_aired'] !== null ? intval($row['episodes_aired']) : null,
        'episodesTotal' => $row['episodes_total'] !== null ? intval($row['episodes_total']) : null,
        'seasonLabel' => $row['season_label'] ?? null,
        'seasonKey' => $row['season_key'] ?? null,
        'viewsSeason' => $row['views_season'] !== null ? intval($row['views_season']) : 0,
        'genres' => $genres,
        'description' => $row['description'] ?? '',
        'colorKey' => $row['color_key'] ?? 'orange',
        'featured' => !empty($row['featured']),
        'downloadUrl' => $row['download_url'] ?? null,
    ];
}

function normalize_anime($a)
{
    $genres = $a['genres'] ?? [];
    if (is_string($genres)) {
        $parts = explode(',', $genres);
        $genres = [];
        foreach ($parts as $g) {
            $g = trim($g);
            if ($g !== '') {
                $genres[] = $g;
            }
        }
    }
    if (!is_array($genres)) {
        $genres = [];
    }

    return [
        'id' => isset($a['id']) ? trim($a['id']) : '',
        'title' => isset($a['title']) ? trim($a['title']) : '',
        'altTitle' => isset($a['altTitle']) ? trim($a['altTitle']) : null,
        'type' => isset($a['type']) ? trim($a['type']) : null,
        'quality' => isset($a['quality']) ? trim($a['quality']) : null,
        'section' => isset($a['section']) ? trim($a['section']) : '',
        'status' => isset($a['status']) ? trim($a['status']) : null,
        'score' => isset($a['score']) && $a['score'] !== '' ? floatval($a['score']) : null,
        'episodesAired' => isset($a['episodesAired']) && $a['episodesAired'] !== '' ? intval($a['episodesAired']) : null,
        'episodesTotal' => isset($a['episodesTotal']) && $a['episodesTotal'] !== '' ? intval($a['episodesTotal']) : null,
        'seasonLabel' => isset($a['seasonLabel']) ? trim($a['seasonLabel']) : null,
        'seasonKey' => isset($a['seasonKey']) ? trim($a['seasonKey']) : null,
        'viewsSeason' => isset($a['viewsSeason']) && $a['viewsSeason'] !== '' ? intval($a['viewsSeason']) : 0,
        'genres' => $genres,
        'description' => isset($a['description']) ? trim($a['description']) : '',
        'colorKey' => isset($a['colorKey']) ? trim($a['colorKey']) : 'orange',
        'featured' => !empty($a['featured']),
        'downloadUrl' => isset($a['downloadUrl']) ? trim($a['downloadUrl']) : null,
    ];
}

function validate_anime($a)
{
    if ($a['id'] === '') {
        return 'ID wajib diisi.';
    }
    if ($a['title'] === '') {
        return 'Judul wajib diisi.';
    }
    if ($a['section'] === '') {
        return 'Section wajib diisi.';
    }
    return null;
}

$isAdmin = isset($_SESSION['admin_id']);

if ($method === 'GET') {
    // Public list/detail
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM anime WHERE id = ? LIMIT 1');
        $stmt->execute([$_GET['id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            send_json(['error' => 'Anime tidak ditemukan'], 404);
        }
        send_json(map_anime_row($row));
    } else {
        $stmt = $pdo->query('SELECT * FROM anime');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $out = [];
        foreach ($rows as $row) {
            $out[] = map_anime_row($row);
        }
        send_json($out);
    }
}

if (!$isAdmin) {
    send_json(['error' => 'Unauthorized'], 401);
}

$body = json_input();
$anime = normalize_anime($body);
$error = validate_anime($anime);
if ($error) {
    send_json(['error' => $error], 400);
}

$now = date('Y-m-d H:i:s');
$genresJson = json_encode($anime['genres']);
$featured = $anime['featured'] ? 1 : 0;

if ($method === 'POST') {
    if ($featured) {
        $pdo->exec("UPDATE anime SET featured = 0 WHERE featured = 1");
    }

    $stmt = $pdo->prepare('
        INSERT INTO anime (
            id, title, alt_title, type, quality, section, status, score,
            episodes_aired, episodes_total, season_label, season_key,
            views_season, genres, description, color_key, featured, download_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');

    try {
        $stmt->execute([
            $anime['id'],
            $anime['title'],
            $anime['altTitle'],
            $anime['type'],
            $anime['quality'],
            $anime['section'],
            $anime['status'],
            $anime['score'],
            $anime['episodesAired'],
            $anime['episodesTotal'],
            $anime['seasonLabel'],
            $anime['seasonKey'],
            $anime['viewsSeason'],
            $genresJson,
            $anime['description'],
            $anime['colorKey'],
            $featured,
            $anime['downloadUrl'],
            $now,
            $now
        ]);
    } catch (Exception $e) {
        send_json(['error' => 'Gagal menyimpan anime (kemungkinan ID sudah digunakan).'], 400);
    }

    send_json(['ok' => true]);
}

if ($method === 'PUT') {
    if (empty($_GET['id'])) {
        send_json(['error' => 'ID diperlukan di query ?id=...'], 400);
    }
    $idParam = $_GET['id'];

    if ($featured) {
        $pdo->exec("UPDATE anime SET featured = 0 WHERE featured = 1");
    }

    $stmt = $pdo->prepare('
        UPDATE anime SET
          id = ?, title = ?, alt_title = ?, type = ?, quality = ?, section = ?, status = ?,
          score = ?, episodes_aired = ?, episodes_total = ?, season_label = ?, season_key = ?,
          views_season = ?, genres = ?, description = ?, color_key = ?, featured = ?, download_url = ?, updated_at = ?
        WHERE id = ?
    ');
    $stmt->execute([
        $anime['id'],
        $anime['title'],
        $anime['altTitle'],
        $anime['type'],
        $anime['quality'],
        $anime['section'],
        $anime['status'],
        $anime['score'],
        $anime['episodesAired'],
        $anime['episodesTotal'],
        $anime['seasonLabel'],
        $anime['seasonKey'],
        $anime['viewsSeason'],
        $genresJson,
        $anime['description'],
        $anime['colorKey'],
        $featured,
        $anime['downloadUrl'],
        $now,
        $idParam
    ]);

    if ($stmt->rowCount() === 0) {
        send_json(['error' => 'Anime tidak ditemukan.'], 404);
    }
    send_json(['ok' => true]);
}

if ($method === 'DELETE') {
    if (empty($_GET['id'])) {
        send_json(['error' => 'ID diperlukan di query ?id=...'], 400);
    }
    $idParam = $_GET['id'];
    $stmt = $pdo->prepare('DELETE FROM anime WHERE id = ?');
    $stmt->execute([$idParam]);
    if ($stmt->rowCount() === 0) {
        send_json(['error' => 'Anime tidak ditemukan.'], 404);
    }
    send_json(['ok' => true]);
}

send_json(['error' => 'Method not allowed'], 405);