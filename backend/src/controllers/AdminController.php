<?php

namespace App\Controllers;

use App\Models\Admin;
use App\Models\Tool;
use App\Models\Prompt;
use App\Models\Category;
use App\Utils\Response;
use App\Utils\JwtHelper;
use App\Middleware\AuthMiddleware;

class AdminController
{
    private $adminModel;

    public function __construct()
    {
        $this->adminModel = new Admin();
    }

    public function login()
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        // Validate input
        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Email and password are required', null, 400);
        }

        // Verify credentials
        $admin = $this->adminModel->verifyPassword($data['email'], $data['password']);

        if (!$admin) {
            Response::unauthorized('Invalid credentials');
        }

        // Generate token
        $token = JwtHelper::encode([
            'id' => $admin['id'],
            'email' => $admin['email'],
            'name' => $admin['name'],
            'role' => $admin['role'],
        ]);

        // Update last login
        $this->adminModel->updateLastLogin($admin['id']);

        Response::success([
            'token' => $token,
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name'],
                'role' => $admin['role'],
            ],
        ], 'Login successful');
    }

    public function logout()
    {
        // Token is invalidated on client side
        Response::success(null, 'Logout successful');
    }

    public function me()
    {
        $token = AuthMiddleware::authenticate();
        
        $admin = $this->adminModel->getById($token->id);

        if (!$admin) {
            Response::notFound('Admin not found');
        }

        Response::success($admin, 'Admin retrieved successfully');
    }

    public function dashboard()
    {
        AuthMiddleware::authenticate();

        $toolModel = new Tool();
        $promptModel = new Prompt();
        $categoryModel = new Category();

        // Get statistics
        $db = \App\Config\Database::getInstance();

        $toolStmt = $db->execute("SELECT COUNT(*) as total FROM tools WHERE status = 'published'");
        $totalTools = $toolStmt->fetch()['total'];

        $promptStmt = $db->execute("SELECT COUNT(*) as total FROM prompts WHERE status = 'published'");
        $totalPrompts = $promptStmt->fetch()['total'];

        $categoryStmt = $db->execute("SELECT COUNT(*) as total FROM tool_categories WHERE is_active = 1");
        $totalCategories = $categoryStmt->fetch()['total'];

        $tagStmt = $db->execute("SELECT COUNT(*) as total FROM tags");
        $totalTags = $tagStmt->fetch()['total'];

        Response::success([
            'stats' => [
                'tools' => $totalTools,
                'prompts' => $totalPrompts,
                'categories' => $totalCategories,
                'tags' => $totalTags,
            ],
            'featured' => [
                'tools' => $toolModel->getFeatured(3),
                'prompts' => $promptModel->getTrending(3),
            ],
        ], 'Dashboard data retrieved');
    }
}
