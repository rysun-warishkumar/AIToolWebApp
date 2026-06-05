<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Set headers for CORS and JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Route the request
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestPath = str_replace('/backend/src', '', $requestPath);

// Simple routing
$routes = [
    'GET' => [
        '/api/tools' => 'App\Controllers\ToolController@list',
        '/api/tools/:id' => 'App\Controllers\ToolController@show',
        '/api/prompts' => 'App\Controllers\PromptController@list',
        '/api/prompts/:id' => 'App\Controllers\PromptController@show',
        '/api/categories' => 'App\Controllers\CategoryController@list',
        '/api/tags' => 'App\Controllers\TagController@list',
        '/api/featured' => 'App\Controllers\FeaturedController@list',
        '/api/admin/me' => 'App\Controllers\AdminController@me',
    ],
    'POST' => [
        '/api/admin/login' => 'App\Controllers\AdminController@login',
        '/api/admin/logout' => 'App\Controllers\AdminController@logout',
        '/api/prompts/:id/copy' => 'App\Controllers\PromptController@copy',
    ],
];

// Try to match route
$found = false;
if (isset($routes[$requestMethod])) {
    foreach ($routes[$requestMethod] as $pattern => $handler) {
        if (preg_match($pattern, $requestPath, $matches)) {
            $found = true;
            [$controllerClass, $method] = explode('@', $handler);
            $controller = new $controllerClass();
            $controller->$method(...array_slice($matches, 1));
            break;
        }
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Route not found',
    ]);
}
