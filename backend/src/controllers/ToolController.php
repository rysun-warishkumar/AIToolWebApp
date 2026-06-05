<?php

namespace App\Controllers;

use App\Models\Tool;
use App\Utils\Response;

class ToolController
{
    private $toolModel;

    public function __construct()
    {
        $this->toolModel = new Tool();
    }

    public function list()
    {
        $page = $_GET['page'] ?? 1;
        $perPage = $_GET['perPage'] ?? 12;
        $page = max(1, intval($page));
        $perPage = min(100, max(1, intval($perPage)));

        $filters = [];

        if (!empty($_GET['search'])) {
            $filters['search'] = trim($_GET['search']);
        }

        if (!empty($_GET['category'])) {
            $filters['category_id'] = intval($_GET['category']);
        }

        if (!empty($_GET['pricing'])) {
            $filters['pricing_model'] = $_GET['pricing'];
        }

        if (!empty($_GET['tag'])) {
            $filters['tag_id'] = intval($_GET['tag']);
        }

        $filters['sortBy'] = $_GET['sortBy'] ?? 'popularity_score';
        $filters['sortOrder'] = $_GET['sortOrder'] ?? 'desc';

        $result = $this->toolModel->getAll($page, $perPage, $filters);

        Response::paginated(
            $result['data'],
            $result['total'],
            $page,
            $perPage,
            'Tools retrieved successfully'
        );
    }

    public function show($id)
    {
        $id = intval($id);
        $tool = $this->toolModel->getById($id);

        if (!$tool) {
            Response::notFound('Tool not found');
        }

        Response::success($tool, 'Tool retrieved successfully');
    }

    public function search()
    {
        $query = $_GET['q'] ?? '';
        $page = $_GET['page'] ?? 1;
        $perPage = $_GET['perPage'] ?? 12;

        if (strlen($query) < 2) {
            Response::error('Search query must be at least 2 characters', null, 400);
        }

        $result = $this->toolModel->search($query, $page, $perPage);

        Response::paginated(
            $result['data'],
            $result['total'],
            $page,
            $perPage,
            'Search completed'
        );
    }
}
