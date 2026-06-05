<?php

namespace App\Controllers;

use App\Models\Prompt;
use App\Utils\Response;

class PromptController
{
    private $promptModel;

    public function __construct()
    {
        $this->promptModel = new Prompt();
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

        if (!empty($_GET['complexity'])) {
            $filters['complexity'] = $_GET['complexity'];
        }

        if (!empty($_GET['tag'])) {
            $filters['tag_id'] = intval($_GET['tag']);
        }

        $filters['sortBy'] = $_GET['sortBy'] ?? 'created_at';
        $filters['sortOrder'] = $_GET['sortOrder'] ?? 'desc';

        $result = $this->promptModel->getAll($page, $perPage, $filters);

        Response::paginated(
            $result['data'],
            $result['total'],
            $page,
            $perPage,
            'Prompts retrieved successfully'
        );
    }

    public function show($id)
    {
        $id = intval($id);
        $prompt = $this->promptModel->getById($id);

        if (!$prompt) {
            Response::notFound('Prompt not found');
        }

        Response::success($prompt, 'Prompt retrieved successfully');
    }

    public function copy($id)
    {
        $id = intval($id);
        
        // Verify prompt exists
        $prompt = $this->promptModel->getById($id);
        if (!$prompt) {
            Response::notFound('Prompt not found');
        }

        // Increment copy count
        $this->promptModel->incrementCopyCount($id);

        Response::success(['copy_count' => $prompt['copy_count'] + 1], 'Copy count updated');
    }

    public function search()
    {
        $query = $_GET['q'] ?? '';
        $page = $_GET['page'] ?? 1;
        $perPage = $_GET['perPage'] ?? 12;

        if (strlen($query) < 2) {
            Response::error('Search query must be at least 2 characters', null, 400);
        }

        $result = $this->promptModel->search($query, $page, $perPage);

        Response::paginated(
            $result['data'],
            $result['total'],
            $page,
            $perPage,
            'Search completed'
        );
    }

    public function trending()
    {
        $prompts = $this->promptModel->getTrending(6);
        Response::success($prompts, 'Trending prompts retrieved');
    }
}
