<?php

namespace App\Controllers;

use App\Models\Tag;
use App\Utils\Response;

class TagController
{
    private $tagModel;

    public function __construct()
    {
        $this->tagModel = new Tag();
    }

    public function list()
    {
        $page = $_GET['page'] ?? 1;
        $perPage = $_GET['perPage'] ?? 50;
        $page = max(1, intval($page));
        $perPage = min(100, max(1, intval($perPage)));

        $result = $this->tagModel->getAll($page, $perPage);

        Response::paginated(
            $result['data'],
            $result['total'],
            $page,
            $perPage,
            'Tags retrieved successfully'
        );
    }

    public function popular()
    {
        $limit = $_GET['limit'] ?? 20;
        $limit = min(100, max(1, intval($limit)));

        $tags = $this->tagModel->getPopular($limit);
        Response::success($tags, 'Popular tags retrieved');
    }

    public function show($id)
    {
        $id = intval($id);
        $tag = $this->tagModel->getById($id);

        if (!$tag) {
            Response::notFound('Tag not found');
        }

        Response::success($tag, 'Tag retrieved successfully');
    }
}
